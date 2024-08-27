const Connection = require("../models/Connection");

const connectionsController = {
  get_accepted_connections: async (req, res) => {
    try {
      let userId = req.bsonUserId;
      let limit = parseInt(req.query.limit) || 10;
      let skip = parseInt(req.query.offset) || 0;

      const aggregationPipeline = [
        {
          $match: {
            $or: [{ requester: userId }, { recipient: userId }],
            status: "accepted",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "requester",
            foreignField: "_id",
            as: "requesterDetails",
          },
        },
        {
          $unwind: "$requesterDetails",
        },
        {
          $lookup: {
            from: "users",
            localField: "recipient",
            foreignField: "_id",
            as: "recipientDetails",
          },
        },
        {
          $unwind: "$recipientDetails",
        },
        {
          $lookup: {
            from: "directmessages",
            localField: "last_message",
            foreignField: "_id",
            as: "lastMessageDetails",
          },
        },
        {
          $unwind: {
            path: "$lastMessageDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            status: 1,
            updatedAt: 1,
            user: {
              $cond: {
                if: { $eq: ["$requester", userId] },
                then: {
                  _id: "$recipientDetails._id",
                  email: "$recipientDetails.email",
                  username: "$recipientDetails.username",
                  full_name: "$recipientDetails.full_name",
                  profile_image: "$recipientDetails.profile_image",
                  phone: "$recipientDetails.phone",
                },
                else: {
                  _id: "$requesterDetails._id",
                  email: "$requesterDetails.email",
                  username: "$requesterDetails.username",
                  full_name: "$requesterDetails.full_name",
                  profile_image: "$requesterDetails.profile_image",
                  phone: "$requesterDetails.phone",
                },
              },
            },
            last_message: {
              _id: "$lastMessageDetails._id",
              content: "$lastMessageDetails.content",
              sender: "$lastMessageDetails.sender",
              receiver: "$lastMessageDetails.receiver",
              status: "$lastMessageDetails.status",
              createdAt: "$lastMessageDetails.createdAt",
              updatedAt: "$lastMessageDetails.updatedAt",
            },
          },
        },
        {
          $sort: { updatedAt: -1 }, // Sort by updatedAt timestamp in descending order
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ];

      const acceptedConnections = await Connection.aggregate(
        aggregationPipeline
      );

      res.status(200).json(acceptedConnections);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
};

module.exports = connectionsController;
