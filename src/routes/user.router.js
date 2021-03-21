const {Router} = require('express');

const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');

const router = Router();

router.get(
    '/',
    [
      AuthController.authenticate,
      AuthController.isAuthenticated,
    ],
    UserController.getLoggedUser,
);

module.exports = router;
