import {Router} from 'express';

import AdminAuthMiddleware from '../../middlewares/admin-auth.middleware';
import StatsController from '../../controllers/stats.controller';

const router = Router();

const statsController = new StatsController();

router.get(
    '/',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => statsController.getStats(req, res, next),
);

export default router;
