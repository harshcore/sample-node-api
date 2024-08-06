const JoiErrorFormaters = {
  fieldWithErrorMsg: (error) => {
    return error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
  },
};

module.exports = JoiErrorFormaters;
