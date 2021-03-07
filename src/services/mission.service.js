const { isPointWithinRadius } = require('geolib');
const ObjectId = require('mongodb').ObjectID;

const MissionModel = require('../models/mission');
const UserModel = require('../models/user');
const jwt = require('../lib/jwt');

const missionService = {
  getMissions: async () => {
    const missions = await MissionModel.find();

    return missions;
  },
  getAllMissions: async () => {
    const missions = await MissionModel.find();
    const missionsWithoutLatLng = [];

    missions.map(({ _doc: mission }, index) => {
      missionsWithoutLatLng.push(mission);
      delete missionsWithoutLatLng[index].lat;
      delete missionsWithoutLatLng[index].lng;
    });

    return missionsWithoutLatLng;
  },
  getMission: async (id) => {
    const mission = await MissionModel.findById({ _id: id });

    if (!mission) {
      throw new createError.NotFound(`Não foi encontrada missão com o id ${id}`);
    }

    return mission;
  },
  getNearMissions: async (lat, lng) => {
    const missions = await MissionModel.find();

    const nearMissions = missions.filter((mission) => {
      if (new Date() < mission.available_at || new Date() > mission.expirate_at) {
        return false;
      }
      if (mission.type === 'location') {
        return isPointWithinRadius(
          { latitude: parseFloat(lat), longitude: parseFloat(lng) },
          { latitude: mission.lat, longitude: mission.lng },
          100,
        );
      }
      return true;
    });

    return nearMissions;
  },
  completeMission: async (lat, lng, key, id, userId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new createError.NotFound('Usuário não encontrado.');
    }

    const mission = await MissionModel.findById({ _id: id });

    if (!['location', 'qrcode', 'key'].includes(mission.type)) {
      throw new createError.BadRequest('Erro no tipo da missão.');
    }

    if (new Date() < mission.available_at || new Date() > mission.expirate_at) {
      throw new createError.BadRequest('Missão não disponível.');
    }

    if (mission.type === 'location') {
      if (!isPointWithinRadius(
        { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        { latitude: mission.lat, longitude: mission.lng },
        50,
      )) {
        throw new createError.BadRequest('Fora do campo da missão.');
      }
    } else if (mission.type === 'key') {
      if (mission.key !== key) {
        throw new createError.BadRequest('Senha incorreta.');
      }
    }

    if (user.completed_missions.includes(mission._id)) {
      throw new createError.BadRequest('Missão já realizada');
    }

    user.completed_missions.push(mission._id);
    user.available_packs += mission.number_of_packs;
    user.save();

    return mission;
  },
  createMission: async (
    title,
    location_reference,
    description,
    number_of_packs,
    lat,
    lng,
    available_at,
    expirate_at,
    key,
    type
  ) => {
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

    return newMission;
  },
  editMission: async (
    id,
    title,
    location_reference,
    description,
    number_of_packs,
    lat,
    lng,
    available_at,
    expirate_at,
    key,
    type
  ) => {
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

    return editedMission;
  },
  deleteMission: async (id) => {
    const deletedMission = await MissionModel.findByIdAndDelete(id);

    return deletedMission;
  },
};

module.exports = missionService;
