const {Router} = require('express');

const {body} = require('express-validator');

const AuthMiddleware = require('../middlewares/auth.middleware');
const StickersController = require('../controllers/sticker.controller');

const router = Router();

router.post(
    '/donate',
    [
      body('stickers', 'Invalid field \'stickers\'').not().isEmpty(),
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    StickersController.donate,
);

router.post(
    '/receive',
    [
      body('token', 'Invalid field \'token\'').not().isEmpty(),
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    StickersController.receive,
);

module.exports = router;
