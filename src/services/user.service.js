const ObjectId = require('mongodb').ObjectID;

const UserModel = require('../models/user');

const userService = {
  getUserBasicData: async (id) => {
    const user = await UserModel
        .findById({_id: id})
        .select('nusp name course completedMissions availablePacks openedPacks stickers -_id');

    if (!user) {
      throw new createError.NotFound('Usuário não encontrado');
    }

    return user;
  },
  getUsers: async () => {
    const users = await UserModel.find();

    return users;
  },
  getUsers: async (id) => {
    const user = await UserModel.findById({_id: id});

    if (!user) {
      throw new createError.NotFound(`Não foi encontrado usuário com o id ${id}`);
    }

    return user;
  },
  createUser: async (nusp, name, isAdmin, course) => {
    const newUser = new UserModel();

    newUser._id = new ObjectId();
    newUser.nusp = nusp;
    newUser.name = name;
    newUser.isAdmin = isAdmin;
    newUser.course = course;
    newUser.completedMissions = [];
    newUser.availablePacks = 0;
    newUser.openedPacks = 0;
    newUser.stickers = [];
    newUser.lastTrade = null;

    await newUser.save();

    return newUser;
  },
  editUser: async (id, nusp, name, isAdmin, course) => {
    const editedUser = await UserModel.findByIdAndUpdate(
        id,
        {
          nusp,
          name,
          isAdmin,
          course,
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
