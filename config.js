require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  ALLOWED_ORIGINS: "http://localhost:3000",
  EMAIL: process.env.EMAIL,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

module.exports = CONFIG;
