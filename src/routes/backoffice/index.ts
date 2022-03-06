import {Router} from 'express';

import authRouter from './auth.router';
import usersRouter from './user.router';
import missionRouter from './mission.router';
import statsRouter from './stats.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/missions', missionRouter);
router.use('/stats', statsRouter);

export default router;
