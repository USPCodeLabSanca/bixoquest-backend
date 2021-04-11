const createError = require('http-errors');

const stickerService = require('../services/sticker.service');

const stickerController = {
  donate: async (req, res, next) => {
    try {
      const user = req.user;
      const {stickers} = req.body;

      const token = await stickerService.donate(user, stickers);

      return res.status(200).json(token);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  receive: async (req, res, next) => {
    try {
      const user = req.user;
      const {token} = req.body;

      const donatorName = await stickerService.receive(user, token);

      return res.status(200).json({donatorName: donatorName});
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
};

module.exports = stickerController;
