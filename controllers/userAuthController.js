const User = require("../models/User");
const sendEmail = require("../transporter");
const authEmailOptions = require("../transporter/authEmailOptions");
const generateOTP = require("../utils/otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

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
      },
    });
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errors: [
          {
            field: "email",
            message: "Invalid email or password",
          },
        ],
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        errors: [
          {
            field: "email",
            message: "Please verify your email before signing in",
          },
        ],
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        errors: [
          {
            field: "email",
            message: "Invalid email or password",
          },
        ],
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    res.status(200).json({ message: "Signin successful", token });
  },
  resendVerifyEmailOTP: async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.isVerified) {
      return res.status(400).json({
        errors: [
          {
            field: "otp",
            message: "Could not resend OTP",
          },
        ],
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;

    user.save();

    sendEmail(authEmailOptions.verifyEmail(user, otp));
    res.json({
      data: {
        email,
        otp,
      },
    });
  },
  verifyEmail: async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errors: [
          {
            field: "otp",
            message: "User not found",
          },
        ],
      });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({
        errors: [
          {
            field: "otp",
            message: "Invalid or expired OTP",
          },
        ],
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Signup successful" });
  },
  getProfile: async (req, res) => {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  },
};

module.exports = userAuthController;
