const mongoose = require("mongoose");
const Connection = require("../models/Connection");
const User = require("../models/User");

const addFriendsController = {
  search_friend: async (req, res) => {
    try {
      let userId = new mongoose.Types.ObjectId(req.userId);
      let username = req.query?.username || "";
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;

      let skip = (page - 1) * limit;

      const usersWithConnections = await User.aggregate([
        {
          $match: {
            username: { $regex: username, $options: "i" },
            _id: { $ne: userId },
          },
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
              status: "$connection.status",
              requester: "$connection.requester",
              recipient: "$connection.recipient",
            },
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);

      res.status(200).json(usersWithConnections);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
};

module.exports = addFriendsController;
