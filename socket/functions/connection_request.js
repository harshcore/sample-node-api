const { get_io } = require("..");
const User = require("../../models/User");
const SOCKET_EVENT = require("../event.types");

const connection_request_functions = {
  new_connection_added: async (connection) => {
    io = get_io();

    const user1 = await User.findById(connection.requester);
    const user2 = await User.findById(connection.recipient);

    const connection_data1 = {
      _id: connection._id,
      status: connection.status,
      user: {
        _id: user2._id,
        email: user2.email,
        username: user2.username,
        full_name: user2.full_name,
        phone: user2.phone,
      },
    };

    const connection_data2 = {
      _id: connection._id,
      status: connection.status,
      user: {
        _id: user1._id,
        email: user1.email,
        username: user1.username,
        full_name: user1.full_name,
        phone: user1.phone,
      },
    };

    io.to(user1._id.toString()).emit(
      SOCKET_EVENT.NEW_CONNECTION_ADDED,
      connection_data1
    );
    io.to(user2._id.toString()).emit(
      SOCKET_EVENT.NEW_CONNECTION_ADDED,
      connection_data2
    );
  },
};

module.exports = connection_request_functions;
