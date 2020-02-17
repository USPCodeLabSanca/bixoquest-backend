const { isPointWithinRadius } = require('geolib');
const ObjectId = require('mongodb').ObjectID;

const MissionModel = require('../models/mission');
const UserModel = require('../models/user');
const Response = require('../lib/response');
const jwt = require('../lib/jwt');

module.exports.getMissions = async (req, res) => {
  const missions = await MissionModel.find();

  return Response.success(missions).send(res);
};

module.exports.getAllMissions = async (req, res) => {
  const missions = await MissionModel.find();
  const missionsWithoutLatLng = [];

  missions.map(({ _doc: mission }, index) => {
    missionsWithoutLatLng.push(mission);
    delete missionsWithoutLatLng[index].lat;
    delete missionsWithoutLatLng[index].lng;
  });

  return Response.success(missionsWithoutLatLng).send(res);
};

module.exports.getMission = async (req, res) => {
  const { id } = req.params;

  const mission = await MissionModel.findById({ _id: id });

  if (!mission) {
    return Response.failure(
      `Não foi encontrada missão com o id ${id}`,
      404,
    ).send(res);
  }

  return Response.success(mission).send(res);
};

module.exports.getNearMissions = async (req, res) => {
  const { lat, lng } = req.query;
  const missions = await MissionModel.find();

  const nearMissions = missions.filter((mission) => {
    if (mission.type === 'location') {
      return isPointWithinRadius(
        { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        { latitude: mission.lat, longitude: mission.lng },
        100,
      );
    }
    return true;
  });

  return Response.success(nearMissions).send(res);
};

module.exports.completeMission = async (req, res) => {
  const { lat, lng, key } = req.body;
  const { id } = req.params;
  const { id: userId } = req.auth;

  const user = await UserModel.findById(userId);
  if (!user) {
    return Response.failure('Usuário não encontrado.', 404).send(res);
  }

  const mission = await MissionModel.findById({ _id: id });

  if (!['location', 'qrcode', 'key'].includes(mission.type)) {
    return Response.failure('Erro no tipo da missão.', 400).send(res);
  }

  if (mission.type === 'location') {
    if (!isPointWithinRadius(
      { latitude: parseFloat(lat), longitude: parseFloat(lng) },
      { latitude: mission.lat, longitude: mission.lng },
      50,
    )) {
      return Response.failure('Fora do campo da missão.', 400).send(res);
    }
  } else if (mission.type === 'key') {
    if (mission.key !== key) {
      return Response.failure('Senha incorreta.', 400).send(res);
    }
  }

  if (!user.completed_missions.includes(mission._id)) {
    user.completed_missions.push(mission._id);
    user.available_packs += mission.number_of_packs;
    user.save();
    return Response.success(mission).send(res);
  }

  return Response.failure('Missão já realizada', 400).send(res);
};

module.exports.createMission = async (req, res) => {
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

  const missionId = new ObjectId();

  newMission._id = missionId;
  newMission.title = title;
  newMission.location_reference = location_reference;
  newMission.description = description;
  newMission.number_of_packs = number_of_packs;
  newMission.lat = lat;
  newMission.lng = lng;
  newMission.available_at = available_at;
  newMission.expirate_at = expirate_at;
  newMission.type = type;
  if (type === 'qrcode') {
    newMission.key = jwt.create({ isMission: true, missionId });
  } else {
    newMission.key = key;
  }

  await newMission.save();

  return Response.success(newMission).send(res);
};

module.exports.editMission = async (req, res) => {
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
};

module.exports.deleteMission = async (req, res) => {
  const { id } = req.params;

  const deletedMission = await MissionModel.findByIdAndDelete(id);

  return Response.success(deletedMission).send(res);
};
