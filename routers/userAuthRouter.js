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

userAuthRouter.post(
  "/verify-email",
  validateBody(userAuthBodyValidators.verifyOTP),
  userAuthController.verifyEmail
);

userAuthRouter.post(
  "/resend-verify-email-otp",
  validateBody(userAuthBodyValidators.resendVerifyEmailOTP),
  userAuthController.resendVerifyEmailOTP
);

module.exports = userAuthRouter;
