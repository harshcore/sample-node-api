const nodemailer = require("nodemailer");
const CONFIG = require("../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: CONFIG.EMAIL, // Your email address
    pass: CONFIG.EMAIL_PASS, // Your password
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Email server connection is ready");
  })
  .catch((error) => {
    console.error("Error connecting to email server:", error);
    process.exit(1);
  });

const sendEmail = (options) => {
  return transporter.sendMail(options);
};

module.exports = sendEmail;
