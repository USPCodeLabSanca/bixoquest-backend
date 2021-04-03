const ObjectId = require('mongodb').ObjectID;

const UserModel = require('../models/user');

const userService = {
  getUserBasicData: async (id) => {
    const user = await UserModel
        .findById(id)
        .select('nusp name course discord completedMissions availablePacks openedPacks stickers -_id');

    if (!user) {
      throw new createError.NotFound('Usuário não encontrado');
    }

    return user;
  },
  getUserProfile: async (id) => {
    const user = await UserModel
        .findById(id)
        .select('name course discord -_id');

    if (!user) {
      throw new createError.NotFound(`Não foi encontrado usuário com o id ${id}`);
    }

    return user;
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
  createUser: async (nusp, name, isAdmin, course, discord) => {
    const newUser = new UserModel();

    newUser._id = new ObjectId();
    newUser.nusp = nusp;
    newUser.name = name;
    newUser.isAdmin = isAdmin;
    newUser.course = course;
    newUser.discord = discord;
    newUser.completedMissions = [];
    newUser.availablePacks = 0;
    newUser.openedPacks = 0;
    newUser.stickers = [];
    newUser.lastTrade = null;

    await newUser.save();

    return newUser;
  },
  editUser: async (id, nusp, name, isAdmin, course, discord) => {
    const editedUser = await UserModel.findByIdAndUpdate(
        id,
        {
          nusp,
          name,
          isAdmin,
          course,
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
