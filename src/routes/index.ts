import {Router} from 'express';

import jwt from 'jsonwebtoken';

import authRouter from './auth.router';
import backofficeRouter from './backoffice/index';
import usersRouter from './user.router';
import friendsRouter from './friend.router';
import packsRouter from './pack.router';
import missionsRouter from './mission.router';
import stickersRouter from './sticker.router';
import AuthMiddleware from '../middlewares/auth.middleware';
import MissionsController from '../controllers/mission.controller';

const router = Router();

router.use('/backoffice', backofficeRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/friends', friendsRouter);
router.use('/packs', packsRouter);
router.use('/missions', missionsRouter);
router.use('/stickers', stickersRouter);

interface Token {
  data: any;
}

router.post(
    '/qrcode/scan',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => {
      const {token} = req.body;

      const decodedToken = (jwt.verify(token, process.env.JWT_PRIVATE_KEY as string) as Token).data;

      if (decodedToken.isMission) {
        req.params.id = decodedToken.missionId;
        MissionsController.completeMission(req, res, next);
      }
    },
);

export default router;
