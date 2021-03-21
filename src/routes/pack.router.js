const {Router} = require('express');

const AuthController = require('../controllers/auth.controller');
const PacksController = require('../controllers/pack.controller');

const router = Router();

router.post(
    '/open',
    [
      AuthController.authenticate,
      AuthController.isAuthenticated,
    ],
    PacksController.openPack,
);

module.exports = router;
