const { Router } = require('express');

const PacksController = require('../controllers/packs');
const { withAuthorization } = require('../lib/jwt');

const router = Router();

router.post(
  '/open',
  withAuthorization(PacksController.openPack),
);

module.exports = router;
