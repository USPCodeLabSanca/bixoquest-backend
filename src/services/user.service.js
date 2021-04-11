const createError = require('http-errors');
const ObjectId = require('mongodb').ObjectID;

const UserModel = require('../models/user');

const userService = {
  getUserBasicData: async (id) => {
    const user = await UserModel
        .findById(id)
        .select('nusp name course character discord completedMissions availablePacks openedPacks stickers -_id');

    if (!user) {
      throw new createError.NotFound('Usuário não encontrado');
    }

    return user;
  },
  getUserProfile: async (id) => {
    const user = await UserModel
        .findById(id)
        .select('name course character discord -_id');

    if (!user) {
      throw new createError.NotFound(`Não foi encontrado usuário com o id ${id}`);
    }

    return user;
  },
  addFriend: async (id, idFriend) => {
    const user = await UserModel.findById(id);
    const friend = await UserModel.findById(idFriend);

    if (!friend || friend.isAdmin) {
      throw new createError.NotFound(`Não foi encontrado usuário com o id ${idFriend}`);
    } else if (friend._id == user._id) {
      throw new createError.BadRequest('Não pode adicionar o mesmo usuário que requisitou');
    } else if (user.friends && !user.friends.find((friend) => friend === idFriend)) {
      throw new createError.BadRequest('Usuário já foi adicionado');
    }

    user.friends.push(idFriend);
    await user.save();

    return friend;
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
    newUser.isAdmin = isAdmin;
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
  editUser: async (id, nusp, name, isAdmin, course, character, discord) => {
    const editedUser = await UserModel.findByIdAndUpdate(
        id,
        {
          nusp,
          name,
          isAdmin,
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
};

module.exports = userService;
