const {Router} = require('express');
const {body} = require('express-validator');

const AdminAuthController = require('../../controllers/admin-auth.controller');

const router = Router();

router.post(
    '/signup',
    [
      body('email', 'Invalid field \'email\'').isEmail(),
      body('password', 'Invalid field \'password\'').isLength({min: 6}),
    ],
    (req, res, next) => AdminAuthController.signup(req, res, next),
);

router.post(
    '/login',
    [
      body('email', 'Invalid field \'email\'').isEmail(),
      body('password', 'Invalid field \'password\'').isLength({min: 6}),
    ],
    (req, res, next) => AdminAuthController.login(req, res, next),
);

module.exports = router;
