const express = require("express");
const userAuthController = require("../controllers/userAuthController");
const userAuthBodyValidators = require("../validators/userAuthBodyValidators");
const validateBody = require("../middleware/validateBody");

const userAuthRouter = express.Router();

userAuthRouter.post(
  "/register",
  validateBody(userAuthBodyValidators.register),
  userAuthController.register
);

module.exports = userAuthRouter;
