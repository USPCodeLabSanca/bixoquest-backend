const createError = require('http-errors');

const userService = require('../services/user.service');
const {formatUser} = require('../lib/format-user');

const userController = {
  addFriend: async (req, res, next) => {
    try {
      const user = req.user;
      const {idFriend} = req.body;

      const friend = await userService.addFriend(user, idFriend);

      return res.status(200).json(formatUser(friend, [
        '_id',
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
  removeFriend: async (req, res, next) => {
    try {
      const user = req.user;
      const {idFriend} = req.body;

      const friend = await userService.removeFriend(user, idFriend);
      return res.status(200).json();
      
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  getFriends: async (req, res, next) => {
    try {
      const {id} = req.user;

      const friends = await userService.getUserFriends(id);

      const formatedFriends = [];
      for (const friend of friends) {
        formatedFriends.push(formatUser(friend, [
          '_id',
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
};

module.exports = userController;
