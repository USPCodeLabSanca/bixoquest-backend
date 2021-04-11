const createError = require('http-errors');

const userService = require('../services/user.service');

const userController = {
  getLoggedUser: async (req, res, next) => {
    try {
      return res.status(200).json(req.user);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  getUserProfile: async (req, res, next) => {
    try {
      const {id} = req.params;

      const user = await userService.getUserProfile(id);

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  getUsers: async (req, res, next) => {
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
  },
  getUser: async (req, res, next) => {
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
  },
  createUser: async (req, res, next) => {
    try {
      const {
        nusp,
        name,
        course,
        character,
        discord,
      } = req.body;

      const newUser = await userService.createUser(nusp, name, course, character, discord);

      return res.status(200).json(newUser);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  editUser: async (req, res, next) => {
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
  },
  updateUserProfile: async (req, res, next) => {
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
  },
  deleteUser: async (req, res, next) => {
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
  },
};

module.exports = userController;
