const { Router } = require('express');

const ObjectId = require('mongodb').ObjectID;

const MissionModel = require('../../models/mission');
const Response = require('../../lib/response');

const router = Router();

router.get('/', async (req, res) => {
  const missions = await MissionModel.find();

  return Response.success(missions).send(res);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const mission = await MissionModel.findById({ _id: id });

  if (!mission) {
    return Response.failure(
      `Não foi encontrada missão com o id ${id}`,
      404,
    ).send(res);
  }

  return Response.success(mission).send(res);
});

router.post('/', async (req, res) => {
  const {
    title,
    location_reference,
    description,
    number_of_packs,
    lat,
    lng,
    available_at,
    expirate_at,
    key,
    type,
  } = req.body;

  const newMission = new MissionModel();

  newMission._id = new ObjectId();
  newMission.title = title;
  newMission.location_reference = location_reference;
  newMission.description = description;
  newMission.number_of_packs = number_of_packs;
  newMission.lat = lat;
  newMission.lng = lng;
  newMission.available_at = available_at;
  newMission.expirate_at = expirate_at;
  newMission.key = key;
  newMission.type = type;

  await newMission.save();

  return Response.success(newMission).send(res);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title,
    location_reference,
    description,
    number_of_packs,
    lat,
    lng,
    available_at,
    expirate_at,
    key,
    type,
  } = req.body;

  const editedMission = await MissionModel.findByIdAndUpdate(
    id,
    {
      title,
      location_reference,
      description,
      number_of_packs,
      lat,
      lng,
      available_at,
      expirate_at,
      key,
      type,
    },
    { new: true },
  );

  return Response.success(editedMission).send(res);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deletedMission = await MissionModel.findByIdAndDelete(id);

  return Response.success(deletedMission).send(res);
});

module.exports = router;
