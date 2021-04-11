const packService = require('../services/pack.service');

const packController = {
  openPack: async (req, res) => {
    try {
      const {id: userId} = req.auth;

      const stickerId = await packService.openPack(userId);

      return res.status(200).json({stickerId: stickerId});
    } catch (error) {
      return res.send(error);
    }
  },
};

module.exports = packController;
