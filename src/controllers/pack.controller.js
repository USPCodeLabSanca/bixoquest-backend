const packService = require('../services/pack.service');
const Response = require('../lib/response');

const packController = {
  openPack: async (req, res) => {
    try {
      const { id: userId } = req.auth;

      const stickerId = await packService.openPack(userId);

      return Response.success({ sticker_id: stickerId }).send(res);
    } catch (error) {
      return res.send(error);
    }
  }
};

module.exports = packController;
