const express = require("express");
const authMiddleware = require("../middleware/authHandler");
const connectionsController = require("../controllers/connectionsController");

const connectionsRouter = express.Router();

connectionsRouter.get(
  "/get-accepted",
  authMiddleware,
  connectionsController.get_accepted_connections
);

module.exports = connectionsRouter;
