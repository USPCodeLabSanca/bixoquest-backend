const {Router} = require('express');

const AuthController = require('../controllers/auth.controller');
const MissionsController = require('../controllers/mission.controller');

const router = Router();

router.get(
    '/all',
    [
      AuthController.authenticate,
      AuthController.isAuthenticated,
    ],
    MissionsController.getAllMissions,
);

router.get(
    '/:id',
    [
      AuthController.authenticate,
      AuthController.isAuthenticated,
    ],
    MissionsController.getMission,
);

router.get(
    '/',
    [
      AuthController.authenticate,
      AuthController.isAuthenticated,
    ],
    MissionsController.getNearMissions,
);

router.post(
    '/:id/complete',
    [
      AuthController.authenticate,
      AuthController.isAuthenticated,
    ],
    MissionsController.completeMission,
);

module.exports = router;
