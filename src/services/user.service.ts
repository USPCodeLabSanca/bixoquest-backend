import createError from 'http-errors';
import {ObjectId} from 'mongodb';

import UserModel from '../models/user';

export default {
  addFriend: async (user: any, idFriend: string) => {
    const friend = await UserModel.findById(idFriend);

    if (!friend) {
      throw new createError.NotFound(`Não foi encontrado usuário com o id ${idFriend}`);
    } else if (friend._id.toString() == user._id.toString()) {
      throw new createError.BadRequest('Não pode adicionar o mesmo usuário que requisitou');
    } else if (user.friends.find((friend: any) => friend.toString() === idFriend.toString())) {
      throw new createError.BadRequest('Usuário já foi adicionado');
    }

    user.friends.push(idFriend);
    await user.save();

    return friend;
  },
  getUserFriends: async (id: string) => {
    const user = await UserModel.findById(id).populate('friends');

    return user.friends;
  },
  getUsers: async () => {
    const users = await UserModel.find();

    return users;
  },
  getUser: async (id: string) => {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new createError.NotFound(`Não foi encontrado usuário com o id ${id}`);
    }

    return user;
  },
  createUser: async (
    nusp: string,
    name: string,
    isAdmin: boolean,
    course: string,
    character: {[key: string]: any},
    discord: string
  ) => {
    const newUser = new UserModel();

    newUser._id = new ObjectId();
    newUser.nusp = nusp;
    newUser.name = name;
    newUser.course = course;
    newUser.discord = discord;
    newUser.character = character;
    newUser.completedMissions = [];
    newUser.availablePacks = 0;
    newUser.openedPacks = 0;
    newUser.stickers = [];
    newUser.lastTrade = null;

    await newUser.save();

    return newUser;
  },
  editUser: async (
    id: string,
    nusp: string,
    name: string,
    course: string,
    character: {[key: string]: any},
    discord: string
  ) => {
    const editedUser = await UserModel.findByIdAndUpdate(
        id,
        {
          nusp,
          name,
          course,
          character,
          discord,
        },
        {new: true},
    );

    return editedUser;
  },
  deleteUser: async (id: string) => {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    return deletedUser;
  },
};
