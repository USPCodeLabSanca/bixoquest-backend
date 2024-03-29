import createError from 'http-errors';

import userService from '../services/user.service';
import handleValidationResult from '../lib/handle-validation-result';

export default class UserController {
  public async getLoggedUser(req: any, res: any, next: any) {
    try {
      return res.status(200).json(req.user);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async getUserProfile(req: any, res: any, next: any) {
    try {
      handleValidationResult(req);

      const {id} = req.params;

      const user = await userService.getUser(id);

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async getUsers(req: any, res: any, next: any) {
    try {
      const users = await userService.getUsers();

      return res.status(200).json(users);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async getUser(req: any, res: any, next: any) {
    try {
      const {id} = req.params;

      const user = await userService.getUser(id);

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async createUser(req: any, res: any, next: any) {
    try {
      const {
        nusp,
        name,
        course,
        character,
        discord,
      } = req.body;

      const newUser = await userService.createUser(nusp, name, false, course, character, discord);

      return res.status(200).json(newUser);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async editUser(req: any, res: any, next: any) {
    try {
      const {id} = req.params;
      const {
        nusp,
        name,
        course,
        character,
        discord,
      } = req.body;

      const editedUser = await userService.editUser(id, nusp, name, course, character, discord);

      return res.status(200).json(editedUser);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async updateUserProfile(req: any, res: any, next: any) {
    try {
      const {_id, nusp, name, course} = req.user;
      const {
        character,
        discord,
      } = req.body;

      const editedUser = await userService.editUser(_id, nusp, name, course, character, discord);

      return res.status(200).json(editedUser);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }

  public async deleteUser(req: any, res: any, next: any) {
    try {
      const {id} = req.params;

      const deletedUser = await userService.deleteUser(id);

      return res.status(200).json(deletedUser);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  }
};
