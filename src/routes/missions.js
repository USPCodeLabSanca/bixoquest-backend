const { Router } = require('express');

const { isPointWithinRadius } = require('geolib');

const MissionModel = require('../models/mission');
const UserModel = require('../models/user');
const Response = require('../lib/response');
const { validateRequestQuery, missionValidators } = require('../lib/validators');
const { withAuthorization } = require('../lib/jwt');

const router = Router();

router.get('/all', async (req, res) => {
  const missions = await MissionModel.find();
  const missionsWithoutLatLng = [];

  missions.map(({ _doc: mission }, index) => {
    missionsWithoutLatLng.push(mission);
    delete missionsWithoutLatLng[index].lat;
    delete missionsWithoutLatLng[index].lng;
  });

  return Response.success(missionsWithoutLatLng).send(res);
});

router.get('/:id', async (req, res) => {
  const mission = await MissionModel.findById({ _id: req.params.id });

  if (!mission) {
    return Response.failure('Não foi encontrada missão com esse id', 404).send(res);
  }

  return Response.success(mission).send(res);
});

router.get(
  '/',
  validateRequestQuery(missionValidators.mission, async (req, res) => {
    const { lat, lng } = req.query;
    const missions = await MissionModel.find();

    const nearMissions = missions.filter((mission) => isPointWithinRadius(
      { latitude: parseFloat(lat), longitude: parseFloat(lng) },
      { latitude: mission.lat, longitude: mission.lng },
      100,
    ));

    return Response.success(nearMissions).send(res);
  }),
);

router.post(
  '/:id/complete',
  withAuthorization(async (req, res) => {
    const { lat, lng } = req.body;
    const { id } = req.params;
    const { id: userId } = req.auth;

    const user = await UserModel.findById(userId);
    if (!user) {
      return Response.failure('Usuário não encontrado', 404).send(res);
    }

    const mission = await MissionModel.findById({ _id: id });

    if (!isPointWithinRadius(
      { latitude: parseFloat(lat), longitude: parseFloat(lng) },
      { latitude: mission.lat, longitude: mission.lng },
      50,
    )) {
      return Response.failure('Fora do campo da missão', 400).send(res);
    }

    if (mission.type === 'location') {
      if (!user.completed_missions.includes(mission._id)) {
        user.completed_missions.push(mission._id);
        user.available_packs += mission.number_of_packs;
        user.save();
        return Response.success(mission).send(res);
      }
      return Response.failure('Missão já realizada', 400).send(res);
    }

    return Response.failure('Erro no tipo da missão', 400).send(res);
  }),
);

module.exports = router;
