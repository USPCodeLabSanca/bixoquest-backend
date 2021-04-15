const {isPointWithinRadius} = require('geolib');
const ObjectId = require('mongodb').ObjectID;
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const MissionModel = require('../models/mission');
const {formatMission} = require('../lib/format-mission');

const missionService = {
  // App
  getAllMissions: async () => {
    const missions = await MissionModel.find({}, null, {rawResult: true});
    const missionsWithoutLatLngKey = [];

    for (const mission of missions) {
      missionsWithoutLatLngKey.push(formatMission(mission, ['_id', 'title', 'description', 'locationReference', 'availableAt', 'expirateAt', 'type', 'isSpecial']));
    }

    return missionsWithoutLatLngKey;
  },
  getNearMissions: async (lat, lng) => {
    const missions = await MissionModel.find({}, null, {rawResult: true});
    const nearMissions = [];

    for (const mission of missions) {
      if (new Date() < mission.availableAt || new Date() > mission.expirateAt) {
        return;
      }

      if (
        (mission.type === 'location' || mission.type === 'location-with-key') &&
        isPointWithinRadius(
            {latitude: parseFloat(lat), longitude: parseFloat(lng)},
            {latitude: mission.lat, longitude: mission.lng},
            100,
        )
      ) {
        nearMissions.push(
            formatMission(mission, ['_id', 'title', 'description', 'locationReference', 'lat', 'lng', 'availableAt', 'expirateAt', 'type', 'isSpecial']),
        );
      }
    }

    return nearMissions;
  },
  completeMission: async (lat, lng, key, id, user) => {
    const mission = await MissionModel.findById({_id: id});

    if (!['location', 'qrcode', 'key', 'location-with-key', 'group'].includes(mission.type)) {
      throw new createError.BadRequest('Erro no tipo da missão.');
    }

    if (new Date() < mission.availableAt || new Date() > mission.expirateAt) {
      throw new createError.BadRequest('Missão não disponível.');
    }

    if (user.completedMissions.includes(mission._id)) {
      throw new createError.BadRequest('Missão já realizada');
    }

    if (type === 'location') {
      if (!isPointWithinRadius(
          {latitude: parseFloat(lat), longitude: parseFloat(lng)},
          {latitude: mission.lat, longitude: mission.lng},
          50,
      )) {
        throw new createError.BadRequest('Fora do campo da missão.');
      }
    } else if (type === 'key') {
      if (mission.key !== key) {
        throw new createError.BadRequest('Senha incorreta.');
      }
    } else if (type === 'locaton-with-key') {
      if (!isPointWithinRadius(
          {latitude: parseFloat(lat), longitude: parseFloat(lng)},
          {latitude: mission.lat, longitude: mission.lng},
          50,
      )) {
        throw new createError.BadRequest('Fora do campo da missão.');
      }
      if (mission.key !== key) {
        throw new createError.BadRequest('Senha incorreta.');
      }
    }

    user.completedMissions.push(mission._id);
    if (mission.isSpecial) {
      user.availableSpecialPacks += mission.numberOfPacks;
    } else {
      user.availablePacks += mission.numberOfPacks;
    }
    await user.save();

    return formatMission(mission, ['_id', 'title', 'description', 'locationReference', 'availableAt', 'expirateAt', 'type', 'isSpecial']);
  },
  // Backoffice
  getMissions: async () => {
    const missions = await MissionModel.find({}, null, {rawResult: true});

    return missions;
  },
  getMission: async (id) => {
    const mission = await MissionModel.findById(id, null, {rawResult: true});

    if (!mission) {
      throw new createError.NotFound(`Não foi encontrada missão com o id ${id}`);
    }

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
      isSpecial,
  ) => {
    const newMissionObj = {
      _id: new ObjectId(),
      title: title,
      locationReference: locationReference,
      description: description,
      numberOfPacks: numberOfPacks,
      availableAt: availableAt,
      expirateAt: expirateAt,
      type: type,
      isSpecial: isSpecial,
    };

    if (type === 'qrcode') {
      newMissionObj.key = jwt.sign({data: {isMission: true, missionId}}, process.env.JWT_PRIVATE_KEY, {
        expiresIn: '30d',
      });
    } else if (type === 'location') {
      newMissionObj.lat = lat;
      newMissionObj.lng = lng;
    } else if (type === 'key') {
      newMissionObj.key = key;
    } else if (type === 'locaton-with-key') {
      newMissionObj.lat = lat;
      newMissionObj.lng = lng;
      newMissionObj.key = key;
    } else {
      throw new createError.BadRequest('Erro no tipo da missão.');
    }

    const newMission = new MissionModel(newMissionObj);
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
      isSpecial,
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
          isSpecial,
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
