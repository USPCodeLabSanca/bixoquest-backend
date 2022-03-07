import createError from 'http-errors';

import statsService from '../services/stats.service';

export default class StatsController {
  public async getStats(req: any, res: any, next: any) {
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
  }
};
