const SOCKET_EVENT = require("../event.types");

const messageStatusHandler = (io, socket) => {
  const mark_message_as_seen = (data) => {
    socket.to(data.sender).emit(SOCKET_EVENT.MARKED_MESSAGE_AS_SEEN, data);
  };

  socket.on(SOCKET_EVENT.MARK_MESSAGE_AS_SEEN, mark_message_as_seen);
};

module.exports = messageStatusHandler;
