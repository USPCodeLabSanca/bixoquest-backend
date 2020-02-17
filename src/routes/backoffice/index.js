const { Router } = require('express');

const userRouter = require('./users');
const missionRouter = require('./missions');

const router = Router();

router.use('/users', userRouter);
router.use('/missions', missionRouter);

module.exports = router;
