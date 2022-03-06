import {Router} from 'express';
import {body} from 'express-validator';

import AuthMiddleware from '../middlewares/auth.middleware';
import UserController from '../controllers/user.controller';

const router = Router();

router.get(
    '/',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    UserController.getLoggedUser,
);

router.put(
    '/',
    [
      body('discord', 'Invalid field \'discord\'').not().isEmpty(),
      body('character.skin', 'Invalid field \'character.skin\'').notEmpty().isInt({min: 0, max: 5}),
      body('character.cheek', 'Invalid field \'character.cheek\'').notEmpty().isInt({min: 0, max: 5}),
      body('character.clothBottom', 'Invalid field \'character.clothBottom\'').notEmpty().isInt({min: 0, max: 12}),
      body('character.clothTop', 'Invalid field \'character.clothTop\'').notEmpty().isInt({min: 0, max: 17}),
      body('character.eyes', 'Invalid field \'character.eyes\'').notEmpty().isInt({min: 0, max: 15}),
      body('character.feet', 'Invalid field \'character.feet\'').notEmpty().isInt({min: 0, max: 5}),
      body('character.hair', 'Invalid field \'character.hair\'').notEmpty().isInt({min: 0, max: 36}),
      body('character.mouth', 'Invalid field \'character.mouth\'').notEmpty().isInt({min: 0, max: 5}),
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    UserController.updateUserProfile,
);

router.get(
    '/:id',
    [
      AuthMiddleware.authenticate,
      AuthMiddleware.isAuthenticated,
    ],
    UserController.getUserProfile,
);

export default router;
