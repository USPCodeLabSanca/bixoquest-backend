import {Router} from 'express';

import AuthMiddleware from '../middlewares/auth.middleware';
import MissionsController from '../controllers/mission.controller';

const router = Router();

router.get(
    '/all',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    MissionsController.getAllMissions,
);

router.get(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    MissionsController.getNearMissions,
);

router.post(
    '/:id/complete',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    MissionsController.completeMission,
);

export default router;
