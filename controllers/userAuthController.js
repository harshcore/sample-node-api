const User = require("../models/User");
const sendEmail = require("../transporter");
const authEmailOptions = require("../transporter/authEmailOptions");
const generateOTP = require("../utils/otp");
const bcrypt = require("bcrypt");

const userAuthController = {
  register: async (req, res) => {
    const { email, password, username } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({
        errors: [
          {
            field: user.email === email ? "email" : "username",
            message: `${
              user.email === email ? "Email" : "Username"
            } already exists`,
          },
        ],
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      email,
      username: username,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await user.save();

    sendEmail(authEmailOptions.verifyEmail(user, otp));

    res.json({
      data: {
        email,
        otp,
      },
    });
  },
};

module.exports = userAuthController;
