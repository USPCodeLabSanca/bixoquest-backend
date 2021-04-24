const {Router} = require('express');

const AuthMiddleware = require('../middlewares/auth.middleware');
const FriendController = require('../controllers/friend.controller');

const router = Router();

router.post(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    FriendController.addFriend,
);

router.delete(
  '/',
  [
    AuthMiddleware.authenticate,
    AuthMiddleware.isAuthenticated,
  ],
  FriendController.removeFriend,
);

router.get(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    FriendController.getFriends,
);

module.exports = router;
