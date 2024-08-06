require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  ALLOWED_ORIGINS: "http://localhost:3000",
};

module.exports = CONFIG;
