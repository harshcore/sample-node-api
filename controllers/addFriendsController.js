const User = require("../models/User");

const addFriendsController = {
  search_friend: async (req, res) => {
    try {
      let username = req.query?.username || "";
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;

      let skip = (page - 1) * limit;

      let users = await User.find({
        username: { $regex: username, $options: "i" },
      })
        .skip(skip)
        .limit(limit)
        .select("username full_name profile_image isVerified");

      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
};

module.exports = addFriendsController;
