const { Router } = require('express');

const { withAuthorization } = require('../lib/jwt');

const StickersController = require('../controllers/stickers');

const router = Router();

router.post(
  '/donate',
  withAuthorization(StickersController.donate),
);

module.exports = router;
