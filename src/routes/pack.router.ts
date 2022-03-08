import {Router} from 'express';

import AuthMiddleware from '../middlewares/auth.middleware';
import PackController from '../controllers/pack.controller';

const router = Router();

const packController = new PackController();

router.post(
    '/open',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => packController.openPack(req, res, next),
);

router.post(
    '/special/open',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => packController.openSpecialPack(req, res, next),
);

export default router;
