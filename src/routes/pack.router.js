const {Router} = require('express');

const AuthMiddleware = require('../middlewares/auth.middleware');
const PacksController = require('../controllers/pack.controller');

const router = Router();

router.post(
    '/open',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    PacksController.openPack,
);

router.post(
    '/special/open',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    PacksController.openSpecialPack,
);

module.exports = router;
