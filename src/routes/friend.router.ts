import {Router} from 'express';

import AuthMiddleware from '../middlewares/auth.middleware';
import FriendController from '../controllers/friend.controller';

const router = Router();

const friendController = new FriendController();

router.post(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => friendController.addFriend(req, res, next),
);

router.get(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => friendController.getFriends(req, res, next),
);

export default router;
