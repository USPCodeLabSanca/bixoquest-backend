const {Router} = require('express');
const {body} = require('express-validator');

const AuthController = require('../../controllers/auth.controller');

const router = Router();

router.post(
    '/signup',
    [
      body('name', 'Invalid field \'name\'').not().isEmpty(),
      body('email', 'Invalid field \'email\'').isEmail(),
      body('password', 'Invalid field \'password\'').isLength({min: 6}),
    ],
    (req, res, next) => AuthController.signup(req, res, next, true),
);

router.post(
    '/login',
    [
      body('email', 'Invalid field \'email\'').isEmail(),
      body('password', 'Invalid field \'password\'').isLength({min: 6}),
    ],
    (req, res, next) => AuthController.login(req, res, next, true),
);

module.exports = router;
