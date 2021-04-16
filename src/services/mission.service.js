const {isPointWithinRadius} = require('geolib');
const ObjectId = require('mongodb').ObjectID;
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const MissionModel = require('../models/mission');
const {formatMission} = require('../lib/format-mission');

const MINUTES_TO_CLOSE_GROUP_MISSION = 1;

/**
 * formatMissionWithoutKeyLatLngUsers
 *
 * @param {object} mission
 *
 * @return {object}
 */
function formatMissionWithoutKeyLatLngUsers(mission) {
  return formatMission(mission, [
    '_id',
    'title',
    'description',
    'locationReference',
    'availableAt',
    'expirateAt',
    'type',
    'isSpecial',
    'numberOfPacks',
    `minimumOfUsersToComplete`,
  ]);
}

const missionService = {
  // App
  getAllMissions: async () => {
    const missions = await MissionModel.find({}, null, {rawResult: true});
    const missionsWithoutLatLngKey = [];

    for (const mission of missions) {
      missionsWithoutLatLngKey.push(formatMissionWithoutKeyLatLngUsers(mission));
    }

    return missionsWithoutLatLngKey;
  },
  getNearMissions: async (lat, lng) => {
    const missions = await MissionModel.find({}, null, {rawResult: true});
    const nearMissions = [];

    for (const mission of missions) {
      if (new Date() < mission.availableAt || new Date() > mission.expirateAt) {
        continue;
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
            formatMission(mission, ['_id', 'title', 'description', 'locationReference', 'lat', 'lng', 'availableAt', 'expirateAt', 'type', 'isSpecial', 'numberOfPacks']),
        );
      }
    }

    return nearMissions;
  },
  completeMission: async (lat, lng, key, id, user) => {
    const mission = await MissionModel.findById({_id: id}).populate('users');

    if (!['location', 'qrcode', 'key', 'location-with-key', 'group'].includes(mission.type)) {
      throw new createError.BadRequest('Erro no tipo da missão.');
    }

    if (new Date() < mission.availableAt || new Date() > mission.expirateAt) {
      throw new createError.BadRequest('Missão não disponível.');
    }

    if (mission.type === 'group') {
      if (!isPointWithinRadius(
          {latitude: parseFloat(lat), longitude: parseFloat(lng)},
          {latitude: mission.lat, longitude: mission.lng},
          50,
      )) {
        throw new createError.BadRequest('Fora do campo da missão.');
      }
      if (user.completedMissions.includes(mission._id)) {
        return formatMissionWithoutKeyLatLngUsers(mission);
      }
      const missionCloseAt = new Date(mission.lastJoinAt);
      missionCloseAt.setMinutes(missionCloseAt.getMinutes() + MINUTES_TO_CLOSE_GROUP_MISSION);
      if (Date.now() > missionCloseAt.getTime()) {
        mission.users = [];
        mission.lastJoinAt = Date.now();
        mission.users.push(user);

        await mission.save();

        return {...formatMissionWithoutKeyLatLngUsers(mission), closeAt: missionCloseAt};
      } else {
        if (!mission.users.find((missionUser) => missionUser._id === user._id)) {
          mission.users.push(user);
        }
        mission.save();
        if (mission.users.length >= mission.minimumOfUsersToComplete) {
          for await (const missionUser of mission.users) {
            if (!missionUser.completedMissions.includes(mission._id)) {
              missionUser.completedMissions.push(mission._id);
              if (mission.isSpecial) {
                missionUser.availableSpecialPacks += mission.numberOfPacks;
              } else {
                missionUser.availablePacks += mission.numberOfPacks;
              }
              await missionUser.save();
            }
          }
          return formatMissionWithoutKeyLatLngUsers(mission);
        } else {
          return {...formatMissionWithoutKeyLatLngUsers(mission), closeAt: missionCloseAt};
        }
      }
    } else {
      if (user.completedMissions.includes(mission._id)) {
        throw new createError.BadRequest('Missão já realizada');
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
        if (mission.key.trim().toLowerCase().replace(/ /g, '') !== key.trim().toLowerCase().replace(/ /g, '')) {
          throw new createError.BadRequest('Senha incorreta.');
        }
      } else if (mission.type === 'locaton-with-key') {
        if (!isPointWithinRadius(
            {latitude: parseFloat(lat), longitude: parseFloat(lng)},
            {latitude: mission.lat, longitude: mission.lng},
            50,
        )) {
          throw new createError.BadRequest('Fora do campo da missão.');
        }
        if (mission.key.trim().toLowerCase().replace(/ /g, '') !== key.trim().toLowerCase().replace(/ /g, '')) {
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

      return formatMissionWithoutKeyLatLngUsers(mission);
    }
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
      minimumOfUsersToComplete,
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
      minimumOfUsersToComplete,
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
    } else if (type === 'group') {
      newMissionObj.lat = lat;
      newMissionObj.lng = lng;
      newMissionObj.minimumOfUsersToComplete = minimumOfUsersToComplete;
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
      minimumOfUsersToComplete,
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
          minimumOfUsersToComplete,
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
