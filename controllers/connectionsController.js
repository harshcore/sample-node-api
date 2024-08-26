const Connection = require("../models/Connection");

const connectionsController = {
  get_accepted_connections: async (req, res) => {
    try {
      let userId = req.bsonUserId;
      let limit = parseInt(req.query.limit) || 10;
      let skip = parseInt(req.query.skip) || 10;

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
          $project: {
            status: 1,
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
          },
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
