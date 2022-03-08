import createError from 'http-errors';

import userService from '../services/user.service';
import formatUser from '../lib/format-user';

export default class FriendController {
  public async addFriend(req: any, res: any, next: any) {
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
  }

  public async getFriends(req: any, res: any, next: any) {
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
  }
};
