const {Router} = require('express');

const {withAuthorization} = require('../lib/jwt');

const StickersController = require('../controllers/sticker.controller');

const router = Router();

router.post(
    '/donate',
    withAuthorization(StickersController.donate),
);

module.exports = router;
