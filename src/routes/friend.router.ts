import {Router} from 'express';

import AuthMiddleware from '../middlewares/auth.middleware';
import FriendController from '../controllers/friend.controller';

const router = Router();

router.post(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    FriendController.addFriend,
);

router.get(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    FriendController.getFriends,
);

export default router;
