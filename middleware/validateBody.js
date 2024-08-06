const JoiErrorFormaters = require("../utils/JoiErrorFormaters");

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errors = JoiErrorFormaters.fieldWithErrorMsg(error);
      return res.status(400).json({ errors });
    }
    next();
  };
};

module.exports = validateBody;
