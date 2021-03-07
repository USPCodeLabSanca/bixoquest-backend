const missionService = require('../services/mission.service');
const Response = require('../lib/response');

const missionController = {
  getMissions: async (req, res) => {
    try {
      const missions = await missionService.getMissions();

      return Response.success(missions).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  getAllMissions: async (req, res) => {
    try {
      const missionsWithoutLatLng = await missionService.getAllMissions();

      return Response.success(missionsWithoutLatLng).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  getMission: async (req, res) => {
    try {
      const {id} = req.params;

      const mission = await missionService.getMission(id);

      return Response.success(mission).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  getNearMissions: async (req, res) => {
    try {
      const {lat, lng} = req.query;

      const nearMissions = await missionService.getNearMissions(lat, lng);

      return Response.success(nearMissions).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  completeMission: async (req, res) => {
    try {
      const {lat, lng, key} = req.body;
      const {id} = req.params;
      const {id: userId} = req.auth;

      const mission = await missionService.completeMission(lat, lng, key, id, userId);

      return Response.success(mission).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  createMission: async (req, res) => {
    try {
      const {
        title,
        location_reference: locationReference,
        description,
        number_of_packs: numberOfPacks,
        lat,
        lng,
        available_at: availableAt,
        expirate_at: expirateAt,
        key,
        type,
      } = req.body;

      const newMission = await missionService.createMission(
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
      );

      return Response.success(newMission).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  editMission: async (req, res) => {
    try {
      const {id} = req.params;
      const {
        title,
        location_reference: locationReference,
        description,
        number_of_packs: numberOfPacks,
        lat,
        lng,
        available_at: availableAt,
        expirate_at: expirateAt,
        key,
        type,
      } = req.body;

      const editedMission = await missionService.editedMission(
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
      );

      return Response.success(editedMission).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
  deleteMission: async (req, res) => {
    try {
      const {id} = req.params;

      const deletedMission = await missionService.deleteMission(id);

      return Response.success(deletedMission).send(res);
    } catch (error) {
      return res.send(error);
    }
  },
};

module.exports = missionController;
