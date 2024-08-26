const SOCKET_EVENT = require("./event.types");

function initSocket(io) {
  io.on(SOCKET_EVENT.CONNECTION, (socket) => {
    socket.emit(SOCKET_EVENT.CONNECTED);
  });
}

module.exports = initSocket;
