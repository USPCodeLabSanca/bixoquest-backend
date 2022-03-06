import {Router} from 'express';

import {body} from 'express-validator';

import AuthMiddleware from '../middlewares/auth.middleware';
import StickersController from '../controllers/sticker.controller';

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

router.post(
    '/special/donate',
    [
      body('specialStickers', 'Invalid field \'stickers\'').not().isEmpty(),
      body('userId', 'Invalid field \'userId\'').not().isEmpty(),
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    StickersController.donateSpecial,
);

export default router;
