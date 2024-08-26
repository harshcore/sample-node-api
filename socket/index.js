const SOCKET_EVENT = require("./event.types");
const authMiddleware = require("./middlewares/authMiddleware");

let _io;

function initSocket(io) {
  _io = io;
  io.use(authMiddleware).on(SOCKET_EVENT.CONNECTION, (socket) => {
    socket.emit(SOCKET_EVENT.CONNECTED);
    socket.join(socket.userId);
  });
}

function get_io() {
  return _io;
}

module.exports = { initSocket, get_io };
