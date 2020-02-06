const { Router } = require('express');

const authRouter = require('./auth');
const backofficeRouter = require('./backoffice/index');
const missionsRouter = require('./missions');
const stickersRouter = require('./stickers');
const { withAuthorization } = require('../lib/jwt');

const StickersController = require('../controllers/stickers');

const router = Router();

router.use('/auth', authRouter);
router.use('/backoffice', backofficeRouter);
router.use('/missions', missionsRouter);
router.use('/stickers', stickersRouter);

router.post(
  '/qr/scan',
  withAuthorization((req, res) => {
    StickersController.receive(req, res);
  }),
);

module.exports = router;
