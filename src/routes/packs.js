const { Router } = require('express');

const { withAuthorization } = require('../lib/jwt');

const PacksController = require('../controllers/packs');

const router = Router();

router.post(
  '/open',
  withAuthorization(PacksController.openPack),
);

module.exports = router;
