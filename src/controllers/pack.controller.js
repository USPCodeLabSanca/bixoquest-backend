const createError = require('http-errors');

const packService = require('../services/pack.service');

const packController = {
  openPack: async (req, res, next) => {
    try {
      const user = req.user;

      const stickerId = await packService.openPack(user);

      return res.status(200).json({stickerId: stickerId});
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  openSpecialPack: async (req, res, next) => {
    try {
      const user = req.user;

      const specialStickerId = await packService.openSpecialPack(user);

      return res.status(200).json({specialStickerId: specialStickerId});
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
};

module.exports = packController;
