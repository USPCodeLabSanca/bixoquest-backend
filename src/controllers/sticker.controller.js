const createError = require('http-errors');

const stickerService = require('../services/sticker.service');

const stickerController = {
  donate: async (req, res, next) => {
    try {
      const {id: userId} = req.auth;
      const {stickers} = req.body;

      const token = await stickerService.donate(userId, stickers);

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
      const {id: userId} = req.auth;
      const {token} = req.body;

      const donatorName = await stickerService.receive(userId, token);

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
