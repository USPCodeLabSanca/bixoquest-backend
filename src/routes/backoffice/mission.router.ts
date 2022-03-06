import {Router} from 'express';

import AdminAuthMiddleware from '../../middlewares/admin-auth.middleware';
import MissionsController from '../../controllers/mission.controller';

const router = Router();

router.get(
    '/',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    MissionsController.getMissions,
);

router.get(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    MissionsController.getMission,
);

router.post(
    '/',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    MissionsController.createMission,
);

router.put(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    MissionsController.editMission,
);

router.delete(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    MissionsController.deleteMission,
);

export default router;
