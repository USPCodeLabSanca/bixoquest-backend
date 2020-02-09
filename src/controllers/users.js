const ObjectId = require('mongodb').ObjectID;

const UserModel = require('../models/user');
const Response = require('../lib/response');

module.exports.getLoggedUser = async (req, res) => {
  const { id } = req.auth;

  const user = await UserModel.findById({ _id: id });

  if (!user) {
    return Response.failure(
      'Usuário não encontrado',
      404,
    ).send(res);
  }

  return Response.success(user).send(res);
};

module.exports.getUsers = async (req, res) => {
  const users = await UserModel.find();

  return Response.success(users).send(res);
};

module.exports.getUser = async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findById({ _id: id });

  if (!user) {
    return Response.failure(
      `Não foi encontrado usuário com o id ${id}`,
      404,
    ).send(res);
  }

  return Response.success(user).send(res);
};

module.exports.createUser = async (req, res) => {
  const {
    nusp,
    name,
    isAdmin,
    course,
  } = req.body;

  const newUser = new UserModel();

  newUser._id = new ObjectId();
  newUser.nusp = nusp;
  newUser.name = name;
  newUser.isAdmin = isAdmin;
  newUser.course = course;
  newUser.completed_missions = [];
  newUser.available_packs = 0;
  newUser.opened_packs = 0;
  newUser.stickers = [];
  newUser.lastTrade = null;

  await newUser.save();

  return Response.success(newUser).send(res);
};

module.exports.editUser = async (req, res) => {
  const { id } = req.params;
  const {
    nusp,
    name,
    isAdmin,
    course,
  } = req.body;

  const editedUser = await UserModel.findByIdAndUpdate(
    id,
    {
      nusp,
      name,
      isAdmin,
      course,
    },
    { new: true },
  );

  return Response.success(editedUser).send(res);
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const deletedUser = await UserModel.findByIdAndDelete(id);

  return Response.success(deletedUser).send(res);
};
