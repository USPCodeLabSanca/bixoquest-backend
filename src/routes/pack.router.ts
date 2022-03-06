import {Router} from 'express';

import AuthMiddleware from '../middlewares/auth.middleware';
import PacksController from '../controllers/pack.controller';

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

export default router;
