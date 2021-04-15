const {Router} = require('express');

const {body} = require('express-validator');

const AuthMiddleware = require('../middlewares/auth.middleware');
const StickersController = require('../controllers/sticker.controller');

const router = Router();

router.post(
    '/donate',
    [
      body('stickers', 'Invalid field \'stickers\'').not().isEmpty(),
      body('userId', 'Invalid field \'userId\'').not().isEmpty(),
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    StickersController.donate,
);

module.exports = router;
