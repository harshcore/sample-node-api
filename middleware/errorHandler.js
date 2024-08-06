const errorHandler = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(409).json({ error: "Duplicate key error" });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
