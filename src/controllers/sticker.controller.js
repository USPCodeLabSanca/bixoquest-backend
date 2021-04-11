const stickerService = require('../services/sticker.service');

const stickerController = {
  donate: async (req, res) => {
    try {
      const {id: userId} = req.auth;
      const {stickers} = req.body;

      const token = await stickerService.donate(userId, stickers);

      return res.status(200).json(token);
    } catch (error) {
      return res.send(error);
    }
  },
  receive: async (req, res) => {
    try {
      const {id: userId} = req.auth;
      const {token} = req.body;

      const donatorName = await stickerService.receive(userId, token);

      return res.status(200).json({donatorName: donatorName});
    } catch (error) {
      return res.send(error);
    }
  },
};

module.exports = stickerController;
