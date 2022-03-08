import {Router} from 'express';

import {body} from 'express-validator';

import AuthMiddleware from '../middlewares/auth.middleware';
import StickerController from '../controllers/sticker.controller';

const router = Router();

const stickerController = new StickerController();

router.post(
    '/donate',
    [
      body('stickers', 'Invalid field \'stickers\'').not().isEmpty(),
      body('userId', 'Invalid field \'userId\'').not().isEmpty(),
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => stickerController.donate(req, res, next),
);

router.post(
    '/special/donate',
    [
      body('specialStickers', 'Invalid field \'stickers\'').not().isEmpty(),
      body('userId', 'Invalid field \'userId\'').not().isEmpty(),
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => stickerController.donateSpecial(req, res, next),
);

export default router;
