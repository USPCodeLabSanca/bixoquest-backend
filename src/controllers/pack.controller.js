const createError = require('http-errors');

const packService = require('../services/pack.service');

const packController = {
  openPack: async (req, res, next) => {
    try {
      const {id: userId} = req.auth;

      const stickerId = await packService.openPack(userId);

      return res.status(200).json({stickerId: stickerId});
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
