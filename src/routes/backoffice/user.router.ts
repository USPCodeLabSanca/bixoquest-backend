import {Router} from 'express';

import AdminAuthMiddleware from '../../middlewares/admin-auth.middleware';
import UsersController from '../../controllers/user.controller';

const router = Router();

router.get(
    '/',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    UsersController.getUsers,
);

router.get(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    UsersController.getUser,
);

router.post(
    '/',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    UsersController.createUser,
);

router.put(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    UsersController.editUser,
);

router.delete(
    '/:id',
    [
      AdminAuthMiddleware.authenticate,
      AdminAuthMiddleware.isAuthenticated,
    ],
    UsersController.deleteUser,
);

export default router;
