import {Router} from 'express';

import AuthMiddleware from '../middlewares/auth.middleware';
import MissionController from '../controllers/mission.controller';

const router = Router();

const missionController = new MissionController();

router.get(
    '/all',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => missionController.getAllMissions(req, res, next),
);

router.get(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => missionController.getNearMissions(req, res, next),
);

router.post(
    '/:id/complete',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => missionController.completeMission(req, res, next),
);

export default router;
