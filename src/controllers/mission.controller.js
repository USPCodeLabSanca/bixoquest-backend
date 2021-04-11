const missionService = require('../services/mission.service');

const missionController = {
  getMissions: async (req, res) => {
    try {
      const missions = await missionService.getMissions();

      return res.status(200).json(missions);
    } catch (error) {
      return res.send(error);
    }
  },
  getAllMissions: async (req, res) => {
    try {
      const missionsWithoutLatLng = await missionService.getAllMissions();

      return res.status(200).json(missionsWithoutLatLng);
    } catch (error) {
      return res.send(error);
    }
  },
  getMission: async (req, res) => {
    try {
      const {id} = req.params;

      const mission = await missionService.getMission(id);

      return res.status(200).json(mission);
    } catch (error) {
      return res.send(error);
    }
  },
  getNearMissions: async (req, res) => {
    try {
      const {lat, lng} = req.query;

      const nearMissions = await missionService.getNearMissions(lat, lng);

      return res.status(200).json(nearMissions);
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

      return res.status(200).json(mission);
    } catch (error) {
      return res.send(error);
    }
  },
  createMission: async (req, res) => {
    try {
      const {
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

      return res.status(200).json(newMission);
    } catch (error) {
      return res.send(error);
    }
  },
  editMission: async (req, res) => {
    try {
      const {id} = req.params;
      const {
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
      } = req.body;

      const editedMission = await missionService.editMission(
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

      return res.status(200).json(editedMission);
    } catch (error) {
      return res.send(error);
    }
  },
  deleteMission: async (req, res) => {
    try {
      const {id} = req.params;

      const deletedMission = await missionService.deleteMission(id);

      return res.status(200).json(deletedMission);
    } catch (error) {
      return res.send(error);
    }
  },
};

module.exports = missionController;
