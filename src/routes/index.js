const { Router } = require('express');
const authRouter = require('./auth');
const backofficeRouter = require('./backoffice/index');
const missionRouter = require('./missions');
const packRouter = require('./packs');

const router = Router();

router.use('/auth', authRouter);
router.use('/backoffice', backofficeRouter);
router.use('/missions', missionRouter);
router.use('/packs', packRouter);

module.exports = router;
