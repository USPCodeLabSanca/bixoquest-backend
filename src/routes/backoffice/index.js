const {Router} = require('express');

const authRouter = require('./auth.router');
const usersRouter = require('./user.router');
const missionRouter = require('./mission.router');
const statsRouter = require('./stats.router');

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/missions', missionRouter);
router.use('/stats', statsRouter);

module.exports = router;
