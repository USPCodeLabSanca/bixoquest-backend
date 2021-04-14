const {isPointWithinRadius} = require('geolib');
const ObjectId = require('mongodb').ObjectID;
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const MissionModel = require('../models/mission');

const missionService = {
  getMissions: async () => {
    const missions = await MissionModel.find();

    return missions;
  },
  getAllMissions: async () => {
    const missions = await MissionModel.find();
    const missionsWithoutLatLng = [];

    missions.map(({_doc: mission}, index) => {
      const missionWithoutLatLng = {...mission};
      if (missionWithoutLatLng.lat) delete missionWithoutLatLng.lat;
      if (missionWithoutLatLng.lng) delete missionWithoutLatLng.lng;
      if (missionWithoutLatLng.key) delete missionWithoutLatLng.key;
      missionsWithoutLatLng.push(missionWithoutLatLng);
    });

    return missionsWithoutLatLng;
  },
  getMission: async (id) => {
    const mission = await MissionModel.findById({_id: id});

    if (!mission) {
      throw new createError.NotFound(`Não foi encontrada missão com o id ${id}`);
    }

    return mission;
  },
  getNearMissions: async (lat, lng) => {
    const missions = await MissionModel.find();

    const nearMissions = missions.filter((mission) => {
      if (new Date() < mission.availableAt || new Date() > mission.expirateAt) {
        return false;
      }
      if (mission.type === 'location') {
        return isPointWithinRadius(
            {latitude: parseFloat(lat), longitude: parseFloat(lng)},
            {latitude: mission.lat, longitude: mission.lng},
            100,
        );
      }
      return true;
    });

    return nearMissions;
  },
  completeMission: async (lat, lng, key, id, user) => {
    const mission = await MissionModel.findById({_id: id});

    if (!['location', 'qrcode', 'key'].includes(mission.type)) {
      throw new createError.BadRequest('Erro no tipo da missão.');
    }

    if (new Date() < mission.availableAt || new Date() > mission.expirateAt) {
      throw new createError.BadRequest('Missão não disponível.');
    }

    if (mission.type === 'location') {
      if (!isPointWithinRadius(
          {latitude: parseFloat(lat), longitude: parseFloat(lng)},
          {latitude: mission.lat, longitude: mission.lng},
          50,
      )) {
        throw new createError.BadRequest('Fora do campo da missão.');
      }
    } else if (mission.type === 'key') {
      if (mission.key !== key) {
        throw new createError.BadRequest('Senha incorreta.');
      }
    }

    if (user.completedMissions.includes(mission._id)) {
      throw new createError.BadRequest('Missão já realizada');
    }

    user.completedMissions.push(mission._id);
    user.availablePacks += mission.numberOfPacks;
    user.save();

    return mission;
  },
  createMission: async (
      title,
      locationReference,
      description,
      numberOfPacks,
      lat,
      lng,
      availableAt,
      expirateAt,
      key,
      type,
  ) => {
    const newMission = new MissionModel();

    const missionId = new ObjectId();

    newMission._id = missionId;
    newMission.title = title;
    newMission.locationReference = locationReference;
    newMission.description = description;
    newMission.numberOfPacks = numberOfPacks;
    newMission.lat = lat;
    newMission.lng = lng;
    newMission.availableAt = availableAt;
    newMission.expirateAt = expirateAt;
    newMission.type = type;
    if (type === 'qrcode') {
      newMission.key = jwt.sign({data: {isMission: true, missionId}}, process.env.JWT_PRIVATE_KEY, {
        expiresIn: '30d',
      });
    } else {
      newMission.key = key;
    }

    await newMission.save();

    return newMission;
  },
  editMission: async (
      id,
      title,
      locationReference,
      description,
      numberOfPacks,
      lat,
      lng,
      availableAt,
      expirateAt,
      key,
      type,
  ) => {
    const editedMission = await MissionModel.findByIdAndUpdate(
        id,
        {
          title,
          locationReference,
          description,
          numberOfPacks,
          lat,
          lng,
          availableAt,
          expirateAt,
          key,
          type,
        },
        {new: true},
    );

    return editedMission;
  },
  deleteMission: async (id) => {
    const deletedMission = await MissionModel.findByIdAndDelete(id);

    return deletedMission;
  },
};

module.exports = missionService;
