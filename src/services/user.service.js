const createError = require('http-errors');
const ObjectId = require('mongodb').ObjectID;

const UserModel = require('../models/user');

const userService = {
  addFriend: async (user, idFriend) => {
    const friend = await UserModel.findById(idFriend);

    if (!friend) {
      throw new createError.NotFound(`Não foi encontrado usuário com o id ${idFriend}`);
    } else if (friend._id.toString() == user._id.toString()) {
      throw new createError.BadRequest('Não pode adicionar o mesmo usuário que requisitou');
    } else if (user.friends.find((friend) => friend.toString() === idFriend.toString())) {
      throw new createError.BadRequest('Usuário já foi adicionado');
    }

    user.friends.push(idFriend);
    await user.save();

    return friend;
  },
  getUserFriends: async (id) => {
    const user = await UserModel.findById(id).populate('friends');

    return user.friends;
  },
  getUsers: async () => {
    const users = await UserModel.find();

    return users;
  },
  getUser: async (id) => {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new createError.NotFound(`Não foi encontrado usuário com o id ${id}`);
    }

    return user;
  },
  createUser: async (nusp, name, isAdmin, course, character, discord) => {
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
  editUser: async (id, nusp, name, course, character, discord) => {
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
  deleteUser: async (id) => {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    return deletedUser;
  },
  migrateUsers: async () => {
    const users = await UserModel.find();

    for await (const user of users) {
      if (!user.availableSpecialPacks) user.availableSpecialPacks = 0;
      if (!user.openedSpecialPacks) user.openedSpecialPacks = 0;
      if (!user.specialStickers) user.specialStickers = [];
      return user.save();
    }

    return users;
  },
};

module.exports = userService;
