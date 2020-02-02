const { Router } = require('express');

const ObjectId = require('mongodb').ObjectID;

const UserModel = require('../../models/user');
const Response = require('../../lib/response');

const router = Router();

router.get('/', async (req, res) => {
  const users = await UserModel.find();

  return Response.success(users).send(res);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findById({ _id: id });

  if (!user) {
    return Response.failure(
      `Não foi encontrado usuário com o id ${id}`,
      404,
    ).send(res);
  }

  return Response.success(user).send(res);
});

router.post('/', async (req, res) => {
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

  await newUser.save();

  return Response.success(newUser).send(res);
});

router.put('/:id', async (req, res) => {
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
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deletedUser = await UserModel.findByIdAndDelete(id);

  return Response.success(deletedUser).send(res);
});

module.exports = router;
