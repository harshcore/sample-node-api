const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication Failed"));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    socket.userId = decoded.userId;
    socket.bsonUserId = new mongoose.Types.ObjectId(socket.userId);
    next();
  } catch (error) {
    next(new Error("Authentication Failed"));
  }
};

module.exports = authMiddleware;
