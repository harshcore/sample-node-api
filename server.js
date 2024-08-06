const cors = require("cors");
const express = require("express");
const CONFIG = require("./config");
const app = express();
const mongoose = require("mongoose");
const userAuthRouter = require("./routers/userAuthRouter");

mongoose
  .connect(CONFIG.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error:", err.message);
    process.exit(1);
  });

// middlewares for apps
app.use(
  cors({
    origin: CONFIG.ALLOWED_ORIGINS,
  })
);

app.use(express.json());

app.get("/status", (req, res) => {
  res.json({
    status: "working",
  });
});

app.use("/user/auth", userAuthRouter);

app.listen(CONFIG.PORT, () => {
  console.log(`server is running at ${CONFIG.PORT}`);
});
