const { Router } = require('express');

const { withAuthorization } = require('../lib/jwt');

const PacksController = require('../controllers/packs');

const router = Router();

router.post(
  '/packs/open',
  withAuthorization(PacksController.openPack),
);

module.exports = router;
