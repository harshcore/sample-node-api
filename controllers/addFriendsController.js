const Connection = require("../models/Connection");
const DirectMessage = require("../models/DirectMessage");
const User = require("../models/User");
const {
  new_connection_added,
} = require("../socket/functions/connection_request");

const addFriendsController = {
  send_connection_request: async (req, res) => {
    try {
      const { recipientId } = req.body;
      const existingConnection = await Connection.findOne({
        $or: [
          { requester: req.bsonUserId, recipient: recipientId },
          { requester: recipientId, recipient: req.bsonUserId },
        ],
      });

      if (existingConnection) {
        return res.status(400).json({
          message: "A connection request already exists between these users.",
        });
      }

      const connection = new Connection({
        requester: req.bsonUserId,
        recipient: recipientId,
      });

      await connection.save();

      res.status(200).json({ message: "Connection request sent.", connection });
    } catch (error) {
      res.status(500).json({ message: "An error occurred.", error });
    }
  },
  respond_on_connection_request: async (req, res) => {
    const { connectionId, status } = req.body;

    try {
      const connection = await Connection.findById(connectionId);

      if (!connection) {
        return res
          .status(404)
          .json({ message: "Connection request not found." });
      }

      if (req.bsonUserId.equals(connection.recipient)) {
        connection.status = status; // 'accepted' or 'rejected'

        const new_message = new DirectMessage({
          on: connection._id,
          sender: connection.recipient,
          receiver: connection.requester,
          content: "You were added in this connection.",
          type: "system",
          status: "seen",
        });

        await new_message.save();
        connection.last_message = new_message._id;
        await connection.save();

        if (connection.status === "accepted") new_connection_added(connection);

        return res
          .status(200)
          .json({ message: `Connection request ${status}.`, connection });
      } else {
        return res
          .status(400)
          .json({ message: "You can respond on this request!.", error });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred.", error });
    }
  },
  search_friend: async (req, res) => {
    try {
      let userId = req.bsonUserId;
      let username = req.query?.username || "";
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      let searchFor = req.query?.searchFor || "search";

      let skip = (page - 1) * limit;

      let matchCondition = {
        _id: { $ne: userId },
      };

      matchCondition.username = { $regex: username, $options: "i" };

      const aggregationPipeline = [
        {
          $match: matchCondition,
        },
        {
          $lookup: {
            from: "connections",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      {
                        $and: [
                          { $eq: ["$requester", userId] },
                          { $eq: ["$recipient", "$$userId"] },
                        ],
                      },
                      {
                        $and: [
                          { $eq: ["$requester", "$$userId"] },
                          { $eq: ["$recipient", userId] },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: "connection",
          },
        },
        {
          $unwind: {
            path: "$connection",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            username: 1,
            full_name: 1,
            profile_image: 1,
            isVerified: 1,
            connection: {
              _id: "$connection._id",
              status: "$connection.status",
              requester: "$connection.requester",
              recipient: "$connection.recipient",
            },
          },
        },
      ];

      if (searchFor !== "search") {
        aggregationPipeline.push({
          $match: {
            "connection.status": searchFor,
          },
        });
      }

      aggregationPipeline.push(
        {
          $skip: skip,
        },
        {
          $limit: limit,
        }
      );

      const usersWithConnections = await User.aggregate(aggregationPipeline);

      res.status(200).json(usersWithConnections);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
};

module.exports = addFriendsController;
