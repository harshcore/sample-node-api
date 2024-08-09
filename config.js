require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS.split(","),
  EMAIL: process.env.EMAIL,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

module.exports = CONFIG;
