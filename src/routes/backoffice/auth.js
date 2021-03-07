const {Router} = require('express');

const AuthController = require('../../controllers/auth');

const router = Router();

router.post('/login', AuthController.loginAdmin);

module.exports = router;
