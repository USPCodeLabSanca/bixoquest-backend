import {Router} from 'express';

import AdminAuthMiddleware from '../../middlewares/admin-auth.middleware';
import UserController from '../../controllers/user.controller';

const router = Router();

const userController = new UserController();

router.get(
    '/',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => userController.getUsers(req, res, next),
);

router.get(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => userController.getUser(req, res, next),
);

router.post(
    '/',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => userController.createUser(req, res, next),
);

router.put(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => userController.editUser(req, res, next),
);

router.delete(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    (req: any, res: any, next: any) => userController.deleteUser(req, res, next),
);

export default router;
