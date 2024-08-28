const express = require("express");
const authMiddleware = require("../middleware/authHandler");
const messagesController = require("../controllers/messagesController");

const messagesRouter = express.Router();

messagesRouter.get(
  "/get",
  authMiddleware,
  messagesController.get_messages_on_connection
);

messagesRouter.post(
  "/send",
  authMiddleware,
  messagesController.send_message_on_connection
);

module.exports = messagesRouter;
