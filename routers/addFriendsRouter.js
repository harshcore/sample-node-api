const express = require("express");
const addFriendsController = require("../controllers/addFriendsController");
const authMiddleware = require("../middleware/authHandler");

const addFriendsRouter = express.Router();

addFriendsRouter.get(
  "/search",
  //   authMiddleware,
  addFriendsController.search_friend
);

module.exports = addFriendsRouter;
