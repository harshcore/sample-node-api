const userAuthController = {
  register: async (req, res) => {
    res.json({
      data: req.body,
    });
  },
};

module.exports = userAuthController;
