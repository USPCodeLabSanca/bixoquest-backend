const {Router} = require('express');

const AuthMiddleware = require('../middlewares/auth.middleware');
const StickersController = require('../controllers/sticker.controller');

const router = Router();

router.post(
    '/donate',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    StickersController.donate,
);

module.exports = router;
