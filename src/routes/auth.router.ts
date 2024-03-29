import {Router} from 'express';
import {body} from 'express-validator';

import AuthMiddleware from '../middlewares/auth.middleware';
import AuthController from '../controllers/auth.controller';

const router = Router();

const authController = new AuthController();

router.post(
    '/signup',
    [
      body('name', 'Invalid field \'name\'').not().isEmpty(),
      body('email', 'Invalid field \'email\'').isEmail(),
      body('password', 'Invalid field \'password\'').isLength({min: 6}),
      body('discord', 'Invalid field \'discord\'').not().isEmpty(),
      body('course', 'Invalid field \'course\'').not().isEmpty(),
      body('character.skin', 'Invalid field \'character.skin\'').notEmpty().isInt({min: 0, max: 5}),
      body('character.cheek', 'Invalid field \'character.cheek\'').notEmpty().isInt({min: 0, max: 5}),
      body('character.clothBottom', 'Invalid field \'character.clothBottom\'').notEmpty().isInt({min: 0, max: 12}),
      body('character.clothTop', 'Invalid field \'character.clothTop\'').notEmpty().isInt({min: 0, max: 17}),
      body('character.eyes', 'Invalid field \'character.eyes\'').notEmpty().isInt({min: 0, max: 15}),
      body('character.feet', 'Invalid field \'character.feet\'').notEmpty().isInt({min: 0, max: 5}),
      body('character.hair', 'Invalid field \'character.hair\'').notEmpty().isInt({min: 0, max: 36}),
      body('character.mouth', 'Invalid field \'character.mouth\'').notEmpty().isInt({min: 0, max: 5}),
    ],
    (req: any, res: any, next: any) => authController.signup(req, res, next),
);

router.post(
    '/signup-usp-second-step',
    [
      body('discord', 'Invalid field \'discord\'').not().isEmpty(),
      body('course', 'Invalid field \'course\'').not().isEmpty(),
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
    (req: any, res: any, next: any) => authController.signupUspSecondStep(req, res, next),
);

router.post(
    '/login',
    [
      body('email', 'Invalid field \'email\'').isEmail(),
      body('password', 'Invalid field \'password\'').isLength({min: 6}),
    ],
    (req: any, res: any, next: any) => authController.login(req, res, next),
);

router.post(
    '/forgot-password',
    [
      body('email', 'Invalid field \'email\'').isEmail(),
    ],
    (req: any, res: any, next: any) => authController.forgotPassword(req, res, next),
);

router.post(
    '/reset-password',
    [
      body('email', 'Invalid field \'email\'').isEmail(),
      body('code', 'Invalid field \'code\'').isLength({min: 12, max: 12}),
      body('password', 'Invalid field \'password\'').isLength({min: 6}),
    ],
    (req: any, res: any, next: any) => authController.resetPassword(req, res, next),
);

router.get(
  '/success',
  (req: any, res: any, next: any) => authController.authenticationSuccess(req, res, next),
);

router.get(
  '/failure',
  (req: any, res: any, next: any) => authController.authenticationFailure(req, res, next),
);

router.get(
  '/logout',
  (req: any, res: any) => authController.logout(req, res),
);

export default router;
