const SOCKET_EVENT = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  CONNECTED: "CONNECTED",
  NEW_CONNECTION_ADDED: "NEW_CONNECTION_ADDED",

  STATUS_UPDATE: (userId) => `STATUS-UPDATE-${userId}`,
  GET_STATUS: "GET_STATUS",

  MARK_MESSAGE_AS_SEEN: "MARK_MESSAGE_AS_SEEN",
  MARKED_MESSAGE_AS_SEEN: "MARKED_MESSAGE_AS_SEEN",
};

module.exports = SOCKET_EVENT;
