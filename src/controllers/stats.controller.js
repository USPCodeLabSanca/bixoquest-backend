const createError = require('http-errors');

const statsService = require('../services/stats.service');

const statsController = {
  getStats: async (req, res, next) => {
    try {
      const stats = await statsService.getStats();

      return res.status(200).json(stats);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
};

module.exports = statsController;
