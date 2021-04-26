const createError = require('http-errors');

const stickerService = require('../services/sticker.service');

const stickerController = {
  donate: async (req, res, next) => {
    try {
      const user = req.user;
      const {stickers, userId: receiverId} = req.body;

      const token = await stickerService.donate(user, stickers, receiverId);

      return res.status(200).json(token);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  donateSpecial: async (req, res, next) => {
    try {
      const user = req.user;
      const {specialStickers, userId: receiverId} = req.body;

      const token = await stickerService.donateSpecial(user, specialStickers, receiverId);

      return res.status(200).json(token);
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
