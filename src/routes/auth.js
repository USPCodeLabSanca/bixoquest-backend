const { Router } = require('express');

const AuthController = require('../controllers/auth');

const router = Router();

router.get('/success', AuthController.authenticationSuccess);

router.get('/failure', AuthController.authenticationFailure);

router.get('/logout', AuthController.logout);

module.exports = router;
