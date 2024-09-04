const { get_io } = require("..");
const DirectMessage = require("../../models/DirectMessage");
const User = require("../../models/User");
const SOCKET_EVENT = require("../event.types");

const connection_request_functions = {
  new_connection_added: async (connection) => {
    io = get_io();

    // io.to(connection.requester._id.toString())
    //   .to(connection.recipient._id.toString())
    //   .emit(SOCKET_EVENT.NEW_CONNECTION_ADDED);

    const user1 = await User.findById(connection.requester);
    const user2 = await User.findById(connection.recipient);

    const last_message = await DirectMessage.findById(
      connection.last_message._id
    );

    const last_message_data = {
      _id: last_message._id,
      content: last_message.content,
      sender: last_message.sender,
      receiver: last_message.receiver,
      status: last_message.status,
      createdAt: last_message.createdAt,
      updatedAt: last_message.updatedAt,
      type: last_message.type,
    };

    const connection_data1 = {
      _id: connection._id,
      status: connection.status,
      updatedAt: connection.updatedAt,
      last_message: last_message_data,
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
      updatedAt: connection.updatedAt,
      last_message: last_message_data,
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
