import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';
import logger from '../lib/winston';
import sendEmail from '../lib/send-email';
import formatUser from '../lib/format-user';
import handleValidationResult from '../lib/handle-validation-result';

export default class AuthController {
  private formatUserResponse(user: any) {
    return {
      success: true,
      message: 'Usuário autenticado com sucesso.',
      user: formatUser(user, [
        '_id',
        'email',
        'nusp',
        'name',
        'discord',
        'course',
        'character',
        'completedMissions',
        'availablePacks',
        'stickers',
        'availableSpecialPacks',
        'openedSpecialPacks',
        'specialStickers',
        'friends',
      ]),
    };
  }

  public async signup(req: any, res: any, next: any) {
    try {
      handleValidationResult(req);

      const {
        email,
        name,
        discord,
        character,
        password,
        course,
      } = req.body;

      const foundUser = await UserModel.findOne({email, nusp: null});
      if (foundUser) {
        throw new createError.Unauthorized();
      }

      const createdUser = new UserModel({
        email,
        nusp: null,
        name,
        discord,
        character,
        password,
        course,
      });
      await createdUser.save();

      await sendEmail(
          createdUser.email,
          'Bem vindo ao BixoQuest 2021!',
          `Você se cadastrou no nosso app e já está tudo certo!!!`,
          `<div><h1>Voc&ecirc;&nbsp;se&nbsp;cadastrou&nbsp;no&nbsp;nosso&nbsp;app&nbsp;e&nbsp;j&aacute;&nbsp;est&aacute;&nbsp;tudo&nbsp;certo!!!</h1></div>`,
      );

      const token = jwt.sign({data: {id: createdUser._id}}, process.env.JWT_PRIVATE_KEY as string, {
        expiresIn: '30d',
      });

      res.setHeader('Authorization', `Bearer ${token}`);

      return res.status(200).json(this.formatUserResponse(createdUser));
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async signupUspSecondStep(req: any, res: any, next: any) {
    try {
      handleValidationResult(req);

      const user = req.user;
      const {
        course,
        discord,
        character,
      } = req.body;

      user.course = course;
      user.discord = discord;
      user.character = character;
      await user.save();

      await sendEmail(
          user.email,
          'Bem vindo ao BixoQuest 2021!',
          `Você se cadastrou no nosso app e já está tudo certo!!!`,
          `<div><h1>Voc&ecirc;&nbsp;se&nbsp;cadastrou&nbsp;no&nbsp;nosso&nbsp;app&nbsp;e&nbsp;j&aacute;&nbsp;est&aacute;&nbsp;tudo&nbsp;certo!!!</h1></div>`,
      );

      const token = jwt.sign({data: {id: user._id}}, process.env.JWT_PRIVATE_KEY as string, {
        expiresIn: '30d',
      });

      res.setHeader('Authorization', `Bearer ${token}`);

      return res.status(200).json(this.formatUserResponse(user));
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async login(req: any, res: any, next: any) {
    try {
      handleValidationResult(req);

      const {
        email,
        password,
      } = req.body;

      const foundUser = await UserModel.findOne({email, nusp: null});
      if (!foundUser || !foundUser.password || !bcrypt.compareSync(password, foundUser.password)) {
        throw new createError.Unauthorized();
      }

      const token = jwt.sign({data: {id: foundUser._id}}, process.env.JWT_PRIVATE_KEY as string, {
        expiresIn: '30d',
      });

      res.setHeader('Authorization', `Bearer ${token}`);

      return res.status(200).json(this.formatUserResponse(foundUser));
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async forgotPassword(req: any, res: any, next: any) {
    try {
      handleValidationResult(req);

      const {
        email,
      } = req.body;

      const foundUser = await UserModel.findOne({email, nusp: null});
      if (!foundUser || !foundUser.password) {
        throw new createError.Unauthorized();
      }

      const code = crypto.randomBytes(6).toString('hex');

      foundUser.resetPasswordCode = code;
      await foundUser.save();

      await sendEmail(
          foundUser.email,
          'Recuperação de Senha',
          `Seu código para recuperação de senha: ${foundUser.resetPasswordCode}`,
          `<div><h1>Seu&nbsp;c&oacute;digo&nbsp;para&nbsp;recupera&ccedil;&atilde;o&nbsp;de&nbsp;senha:&nbsp;${foundUser.resetPasswordCode}</h1></div>`,
      );

      return res.status(200).json();
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async resetPassword(req: any, res: any, next: any) {
    try {
      handleValidationResult(req);

      const {
        email,
        code,
        password,
      } = req.body;

      const foundUser = await UserModel.findOne({email, nusp: null});
      if (!foundUser || !foundUser.password || code !== foundUser.resetPasswordCode) {
        throw new createError.Unauthorized();
      }

      foundUser.password = password;
      await foundUser.save();

      const token = jwt.sign({data: {id: foundUser._id}}, process.env.JWT_PRIVATE_KEY as string, {
        expiresIn: '30d',
      });

      res.setHeader('Authorization', `Bearer ${token}`);

      return res.status(200).json(this.formatUserResponse(foundUser));
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async authenticateUser(data: any, cb: any) {
    const user = JSON.parse(data);
    const currentUser = await UserModel.findOne({
      nusp: user.loginUsuario,
    });

    if (!currentUser) {
      const newUser = new UserModel({
        nusp: user.loginUsuario,
        email: user.emailUspUsuario || 'None',
        name: user.nomeUsuario,
        course: null,
      });

      await newUser.save();

      if (newUser) {
        return cb(null, formatUser(newUser, ['_id']));
      }
    }

    return cb(null, formatUser(currentUser, ['_id']));
  }

  public async authenticationSuccess(req: any, res: any, next: any) {
    try {
      logger.info('req.user');
      logger.info(req.user);

      req.user = await UserModel.findById(req.user._id);
      if (!req.user) {
        throw new createError.Forbidden('Usuário não encontrado.');
      }

      const token = jwt.sign({data: {id: req.user._id}}, process.env.JWT_PRIVATE_KEY as string, {
        expiresIn: '30d',
      });

      res.setHeader('Authorization', `Bearer ${token}`);

      if (req.user && req.user.nusp && req.user.course) {
        return res.status(200).json({
          isSignup: false,
          ...this.formatUserResponse(req.user),
        });
      }
      return res.status(200).json({
        isSignup: true,
        success: true,
      });
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async authenticationFailure(req: any, res: any, next: any) {
    return next(
        new createError.Forbidden('Falha ao autenticar usuário.'),
    );
  }

  public async logout(req: any, res: any) {
    req.logout();
    res.redirect(process.env.FRONTEND_URL);
  }
};
