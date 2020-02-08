const { Router } = require('express');

const { withAuthorization } = require('../lib/jwt');

const UsersController = require('../controllers/users');

const router = Router();

router.get(
  '/',
  withAuthorization(UsersController.getLoggedUser),
);

module.exports = router;
