import {Router} from 'express';
import {body} from 'express-validator';

import AdminAuthController from '../../controllers/admin-auth.controller';

const router = Router();

const adminAuthController = new AdminAuthController();

router.post(
    '/signup',
    [
      body('email', 'Invalid field \'email\'').isEmail(),
      body('password', 'Invalid field \'password\'').isLength({min: 6}),
    ],
    (req: any, res: any, next: any) => adminAuthController.signup(req, res, next),
);

router.post(
    '/login',
    [
      body('email', 'Invalid field \'email\'').isEmail(),
      body('password', 'Invalid field \'password\'').isLength({min: 6}),
    ],
    (req: any, res: any, next: any) => adminAuthController.login(req, res, next),
);

export default router;
