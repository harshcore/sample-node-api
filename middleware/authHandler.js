const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized Access." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    req.bsonUserId = new mongoose.Types.ObjectId(req.userId);
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized Access." });
  }
};

module.exports = authMiddleware;
