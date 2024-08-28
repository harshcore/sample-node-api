const DirectMessage = require("../models/DirectMessage"); // Adjust the path as necessary
const Connection = require("../models/Connection");
const mongoose = require("mongoose");
const {
  new_connection_added,
} = require("../socket/functions/connection_request");

const messagesController = {
  get_messages_on_connection: async (req, res) => {
    try {
      const {
        connection_id: _connection_id,
        limit = 10,
        offset = 0,
      } = req.query;
      const connection_id = new mongoose.Types.ObjectId(_connection_id);

      const connection = await Connection.findById(connection_id);

      if (!connection && !connection.status === "accepted") {
        return res.status(404).json({ message: "Connection not found" });
      }

      if (
        !req.bsonUserId.equals(connection.recipient) &&
        !req.bsonUserId.equals(connection.requester)
      ) {
        return res.status(404).json({ message: "Connection not found" });
      }

      const messages = await DirectMessage.find({ on: connection_id })
        .sort({ createdAt: 1 })
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .exec();

      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  send_message_on_connection: async (req, res) => {
    try {
      const { connection_id: _connection_id, content } = req.body;
      const connection_id = new mongoose.Types.ObjectId(_connection_id);

      const connection = await Connection.findById(connection_id);

      if (!connection && !connection.status === "accepted") {
        return res.status(404).json({ message: "Connection not found" });
      }

      if (
        !req.bsonUserId.equals(connection.recipient) &&
        !req.bsonUserId.equals(connection.requester)
      ) {
        return res.status(404).json({ message: "Connection not found" });
      }

      let receiver = req.bsonUserId.equals(connection.recipient)
        ? connection.requester
        : connection.recipient;

      const new_message = new DirectMessage({
        on: connection_id,
        sender: req.bsonUserId,
        receiver: receiver,
        content: content,
        type: "user",
        status: "sent",
      });

      await new_message.save();
      connection.last_message = new_message._id;
      await connection.save();
      new_connection_added(connection);

      return res.json(new_message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = messagesController;
