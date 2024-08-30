const SOCKET_EVENT = require("../event.types");
const user_status_functions = require("../functions/user_status");

const userStatusHandler = (io, socket) => {
  const get_status = (userId) => {
    socket.emit(
      SOCKET_EVENT.STATUS_UPDATE(userId),
      user_status_functions.get_status(userId)
    );
  };

  socket.on(SOCKET_EVENT.GET_STATUS, get_status);
};

module.exports = userStatusHandler;
