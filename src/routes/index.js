const {Router} = require('express');

const jwt = require('jsonwebtoken');

const authRouter = require('./auth.router');
const backofficeRouter = require('./backoffice/index');
const usersRouter = require('./user.router');
const friendsRouter = require('./friend.router');
const packsRouter = require('./pack.router');
const missionsRouter = require('./mission.router');
const stickersRouter = require('./sticker.router');

const AuthMiddleware = require('../middlewares/auth.middleware');
const MissionsController = require('../controllers/mission.controller');
const StickersController = require('../controllers/sticker.controller');

const router = Router();

router.use('/backoffice', backofficeRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/friends', friendsRouter);
router.use('/packs', packsRouter);
router.use('/missions', missionsRouter);
router.use('/stickers', stickersRouter);

router.post(
    '/qrcode/scan',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    (req, res) => {
      const {token} = req.body;

      const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY).data;

      if (decodedToken.isMission) {
        req.params.id = decodedToken.missionId;
        MissionsController.completeMission(req, res);
      }
    },
);

module.exports = router;
