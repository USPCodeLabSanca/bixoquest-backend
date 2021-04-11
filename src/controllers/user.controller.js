const createError = require('http-errors');

const userService = require('../services/user.service');
const {formatUser} = require('../lib/format-user');

const userController = {
  getLoggedUser: async (req, res) => {
    try {
      return res.status(200).json(req.user);
    } catch (error) {
      return res.send(error);
    }
  },
  getUserProfile: async (req, res) => {
    try {
      const {id} = req.params;

      const user = await userService.getUserProfile(id);

      return res.status(200).json(user);
    } catch (error) {
      return res.send(error);
    }
  },
  addFriend: async (req, res, next) => {
    try {
      const {id} = req.user;
      const {idFriend} = req.body;

      const friend = await userService.addFriend(id, idFriend);

      return res.status(200).json(formatUser(friend, [
        'name',
        'discord',
        'course',
        'character',
      ]));
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  getUserFriends: async (req, res, next) => {
    try {
      const {id} = req.user;

      const friends = await userService.getUserFriends(id);

      const formatedFriends = [];
      for (const friend of friends) {
        formatedFriends.push(formatUser(friend, [
          'name',
          'discord',
          'course',
          'character',
        ]));
      }

      return res.status(200).json(formatedFriends);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await userService.getUsers();

      return res.status(200).json(users);
    } catch (error) {
      return res.send(error);
    }
  },
  getUser: async (req, res) => {
    try {
      const {id} = req.params;

      const user = await userService.getUser(id);

      return res.status(200).json(user);
    } catch (error) {
      return res.send(error);
    }
  },
  createUser: async (req, res) => {
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
      return res.send(error);
    }
  },
  editUser: async (req, res) => {
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
      return res.send(error);
    }
  },
  updateUserProfile: async (req, res) => {
    try {
      const {_id, nusp, name, course} = req.user;
      const {
        character,
        discord,
      } = req.body;

      const editedUser = await userService.editUser(_id, nusp, name, course, character, discord);

      return res.status(200).json(editedUser);
    } catch (error) {
      return res.send(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const {id} = req.params;

      const deletedUser = await userService.deleteUser(id);

      return res.status(200).json(deletedUser);
    } catch (error) {
      return res.send(error);
    }
  },
};

module.exports = userController;
