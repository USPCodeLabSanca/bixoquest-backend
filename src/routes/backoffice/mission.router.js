const {Router} = require('express');

const AuthMiddleware = require('../../middlewares/auth.middleware');
const MissionsController = require('../../controllers/mission.controller');

const router = Router();

router.get(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
      AuthMiddleware.isAdmin,
    ],
    MissionsController.getMissions,
);

router.get(
    '/:id',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
      AuthMiddleware.isAdmin,
    ],
    MissionsController.getMission,
);

router.post(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
      AuthMiddleware.isAdmin,
    ],
    MissionsController.createMission,
);

router.put(
    '/:id',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
      AuthMiddleware.isAdmin,
    ],
    MissionsController.editMission,
);

router.delete(
    '/:id',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
      AuthMiddleware.isAdmin,
    ],
    MissionsController.deleteMission,
);

module.exports = router;
