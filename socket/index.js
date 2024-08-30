const SOCKET_EVENT = require("./event.types");
const user_status_functions = require("./functions/user_status");
const userStatusHandler = require("./handlers/userStatusHandler");
const authMiddleware = require("./middlewares/authMiddleware");

let _io;

function initSocket(io) {
  _io = io;
  io.use(authMiddleware).on(SOCKET_EVENT.CONNECTION, (socket) => {
    socket.emit(SOCKET_EVENT.CONNECTED);
    socket.join(socket.userId);

    user_status_functions.update_user_status(socket.userId, io);

    socket.on(SOCKET_EVENT.DISCONNECT, () => {
      user_status_functions.update_user_status(socket.userId, io, 0);
    });

    userStatusHandler(io, socket);
  });
}

function get_io() {
  return _io;
}

module.exports = { initSocket, get_io };
