const {Router} = require('express');

const authRouter = require('./auth.router');
const backofficeRouter = require('./backoffice/index');
const usersRouter = require('./user.router');
const packsRouter = require('./pack.router');
const missionsRouter = require('./mission.router');
const stickersRouter = require('./sticker.router');
const jwt = require('../lib/jwt');

const AuthController = require('../controllers/auth.controller');
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
    [
      AuthController.authenticate,
      AuthController.isAuthenticated,
    ],
    (req, res) => {
      const {token} = req.body;

      const decodedToken = jwt.decode(token);

      if (decodedToken.isMission) {
        req.params.id = decodedToken.missionId;
        MissionsController.completeMission(req, res);
      } else {
        StickersController.receive(req, res);
      }
    },
);

module.exports = router;
