const { Router } = require('express');

const authRouter = require('./auth');
const backofficeRouter = require('./backoffice/index');
const usersRouter = require('./users');
const packsRouter = require('./packs');
const missionsRouter = require('./missions');
const stickersRouter = require('./stickers');
const { withAuthorization } = require('../lib/jwt');
const jwt = require('../lib/jwt');

const MissionsController = require('../controllers/mission.controller');
const StickersController = require('../controllers/sticker.controller');

const router = Router();

router.use('/backoffice', backofficeRouter);
router.use('/auth', authRouter);
router.use('/user', usersRouter);
router.use('/packs', packsRouter);
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
