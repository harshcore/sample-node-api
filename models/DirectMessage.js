const mongoose = require("mongoose");

const directMessageSchema = new mongoose.Schema(
  {
    on: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["user", "system"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["seen", "sent"],
      default: "sent",
    },
  },
  { timestamps: true }
);

const DirectMessage = mongoose.model("DirectMessage", directMessageSchema);

module.exports = DirectMessage;
