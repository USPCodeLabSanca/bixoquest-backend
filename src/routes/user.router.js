const {Router} = require('express');

const AuthMiddleware = require('../middlewares/auth.middleware');
const UserController = require('../controllers/user.controller');

const router = Router();

router.get(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    UserController.getLoggedUser,
);

router.post(
    '/add-friend',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    UserController.addFriend,
);

router.get(
    '/friends',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    UserController.getUserFriends,
);

router.put(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    UserController.updateUserProfile,
);

router.get(
    '/:id',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    UserController.getUserProfile,
);

module.exports = router;
