const {Router} = require('express');

const AuthMiddleware = require('../middlewares/auth.middleware');
const MissionsController = require('../controllers/mission.controller');

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

module.exports = router;
