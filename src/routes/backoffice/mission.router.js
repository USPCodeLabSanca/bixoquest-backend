const {Router} = require('express');

const AdminAuthMiddleware = require('../../middlewares/admin-auth.middleware');
const MissionsController = require('../../controllers/mission.controller');

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

module.exports = router;
