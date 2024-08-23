const Joi = require("joi");

const addFriendsBodyValidators = {
  send_connection_request: Joi.object({
    recipientId: Joi.string().required().messages({
      "any.required": "recipientId is required",
    }),
  }),
  respond_on_connection_request: Joi.object({
    connectionId: Joi.string().required().messages({
      "any.required": "recipientId is required",
    }),
    status: Joi.string().valid("accepted", "rejected").required().messages({
      "any.required": "status is required",
      "any.only": "status must be either 'accepted' or 'rejected'",
    }),
  }),
};

module.exports = addFriendsBodyValidators;
