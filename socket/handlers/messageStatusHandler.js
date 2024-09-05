const mongoose = require("mongoose");
const DirectMessage = require("../../models/DirectMessage");
const SOCKET_EVENT = require("../event.types");

const messageStatusHandler = (io, socket) => {
  const mark_message_as_seen = async (data) => {
    socket.to(data.sender).emit(SOCKET_EVENT.MARKED_MESSAGE_AS_SEEN, data);
    const result = await DirectMessage.updateOne(
      { _id: new mongoose.Types.ObjectId(data._id) },
      { $set: { status: "seen" } }
    );
  };

  socket.on(SOCKET_EVENT.MARK_MESSAGE_AS_SEEN, mark_message_as_seen);
};

module.exports = messageStatusHandler;
