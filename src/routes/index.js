const { Router } = require('express');

const authRouter = require('./auth');
const backofficeRouter = require('./backoffice/index');
const packRouter = require('./packs');
const missionsRouter = require('./missions');
const stickersRouter = require('./stickers');
const { withAuthorization } = require('../lib/jwt');
const jwt = require('../lib/jwt');

const MissionsController = require('../controllers/missions');
const StickersController = require('../controllers/stickers');

const router = Router();

router.use('/auth', authRouter);
router.use('/backoffice', backofficeRouter);
router.use('/packs', packRouter);
router.use('/missions', missionsRouter);
router.use('/stickers', stickersRouter);

router.post(
  '/qrcode/scan',
  withAuthorization((req, res) => {
    const { token } = req.body;

    const decodedToken = jwt.decode(token);

    if (decodedToken.isMission) {
      req.params.id = decodedToken.missionId;
      MissionsController.completeMission(req, res);
    } else {
      StickersController.receive(req, res);
    }
  }),
);

module.exports = router;
