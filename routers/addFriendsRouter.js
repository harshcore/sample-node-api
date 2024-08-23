const express = require("express");
const addFriendsController = require("../controllers/addFriendsController");
const authMiddleware = require("../middleware/authHandler");
const addFriendsBodyValidators = require("../validators/addFriendsBodyValidators");
const validateBody = require("../middleware/validateBody");

const addFriendsRouter = express.Router();

addFriendsRouter.get(
  "/search",
  authMiddleware,
  addFriendsController.search_friend
);

addFriendsRouter.post(
  "/send-connection-request",
  authMiddleware,
  validateBody(addFriendsBodyValidators.send_connection_request),
  addFriendsController.send_connection_request
);

addFriendsRouter.post(
  "/respond-on-connection-request",
  authMiddleware,
  validateBody(addFriendsBodyValidators.respond_on_connection_request),
  addFriendsController.respond_on_connection_request
);

module.exports = addFriendsRouter;
