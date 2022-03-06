import {Router} from 'express';

import AdminAuthMiddleware from '../../middlewares/admin-auth.middleware';
import StatsController from '../../controllers/stats.controller';

const router = Router();

router.get(
    '/',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    StatsController.getStats,
);

export default router;
