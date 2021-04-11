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
  '/',
  [
    AuthMiddleware.authenticate,
    AuthMiddleware.isAuthenticated,
  ],
  UserController.addFriend,
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
