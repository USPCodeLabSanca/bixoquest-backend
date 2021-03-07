const stickerService = require('../services/sticker.service');
const Response = require('../lib/response');

const stickerController = {
  donate: async (req, res) => {
    try {
      const { id: userId } = req.auth;
      const { stickers } = req.body;

      const token = await stickerService.donate(userId, stickers);

      return Response.success(token).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  receive: async (req, res) => {
    try {
      const { id: userId } = req.auth;
      const { token } = req.body;

      const donatorName = await stickerService.receive(userId, token);

      return Response.success({ donatorName: donatorName }).send(res);
    } catch (error) {
      return res.send(error);
    }
  }
};

module.exports = stickerController;
