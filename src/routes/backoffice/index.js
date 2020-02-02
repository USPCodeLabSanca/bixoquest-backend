const { Router } = require('express');
const missionRouter = require('./missions');

const router = Router();

router.use('/missions', missionRouter);

module.exports = router;
