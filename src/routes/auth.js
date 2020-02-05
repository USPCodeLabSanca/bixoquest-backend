const { Router } = require('express');

const { validateRequest, authValidators } = require('../lib/validators');

const AuthController = require('../controllers/auth');

const router = Router();

// Login user
router.post(
  '/',
  validateRequest(authValidators.mockAuthUsp, AuthController.loginUser),
);

module.exports = router;
