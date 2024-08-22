const express = require("express");
const addFriendsController = require("../controllers/addFriendsController");
const authMiddleware = require("../middleware/authHandler");

const addFriendsRouter = express.Router();

addFriendsRouter.get(
  "/search",
  authMiddleware,
  addFriendsController.search_friend
);

addFriendsRouter.post(
  "/send-connection-request",
  authMiddleware,
  addFriendsController.send_connection_request
);

module.exports = addFriendsRouter;
