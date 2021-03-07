const {Router} = require('express');

const authRouter = require('./auth');
const usersRouter = require('./users');
const missionRouter = require('./missions');

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/missions', missionRouter);

module.exports = router;
