import {Router} from 'express';

import AdminAuthMiddleware from '../../middlewares/admin-auth.middleware';
import MissionController from '../../controllers/mission.controller';

const router = Router();

const missionController = new MissionController();

router.get(
    '/',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => missionController.getMissions(req, res, next),
);

router.get(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => missionController.getMission(req, res, next),
);

router.post(
    '/',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => missionController.createMission(req, res, next),
);

router.put(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => missionController.editMission(req, res, next),
);

router.delete(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => missionController.deleteMission(req, res, next),
);

export default router;
