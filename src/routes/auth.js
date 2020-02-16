const { Router } = require('express');
const passport = require('passport');

const AuthController = require('../controllers/auth');

const router = Router();

router.get('/success', AuthController.authenticationSuccess);

router.get('/failure', AuthController.authenticationFailure);

router.get('/logout', AuthController.logout);

router.get('/', passport.authenticate('provider'));

router.get('/redirect', passport.authenticate('provider', {
  successRedirect: process.env.FRONTEND_URL,
  failureRedirect: '/api/auth/failure',
}));


module.exports = router;
