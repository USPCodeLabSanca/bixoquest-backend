const {Router} = require('express');

const AuthController = require('../controllers/auth.controller');
const StickersController = require('../controllers/sticker.controller');

const router = Router();

router.post(
    '/donate',
    [
      AuthController.authenticate,
      AuthController.isAuthenticated,
    ],
    StickersController.donate,
);

module.exports = router;
