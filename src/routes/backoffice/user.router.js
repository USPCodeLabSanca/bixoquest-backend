const {Router} = require('express');

const AuthMiddleware = require('../middlewares/auth.middleware');
const UsersController = require('../../controllers/user.controller');

const router = Router();

router.get(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
      AuthMiddleware.isAdmin,
    ],
    UsersController.getUsers,
);

router.get(
    '/:id',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
      AuthMiddleware.isAdmin,
    ],
    UsersController.getUser,
);

router.post(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
      AuthMiddleware.isAdmin,
    ],
    UsersController.createUser,
);

router.put(
    '/:id',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
      AuthMiddleware.isAdmin,
    ],
    UsersController.editUser,
);

router.delete(
    '/:id',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
      AuthMiddleware.isAdmin,
    ],
    UsersController.deleteUser,
);

module.exports = router;
