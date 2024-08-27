const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    last_message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DirectMessage",
    },
  },
  { timestamps: true }
);

const Connection = mongoose.model("Connection", connectionSchema);

module.exports = Connection;
