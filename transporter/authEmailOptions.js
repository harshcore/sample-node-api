const CONFIG = require("../config");

const authEmailOptions = {
  verifyEmail: (user, otp) => ({
    from: CONFIG.EMAIL,
    to: user.email,
    subject: "Email verification OTP (SpeakEasy Test App)",
    html: `<h1>Welcome ${user.username}</h1><p>Your email verification OTP</p><code>${otp}</code>`,
  }),
};

module.exports = authEmailOptions;
