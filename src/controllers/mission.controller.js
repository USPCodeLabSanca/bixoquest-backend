const createError = require('http-errors');

const missionService = require('../services/mission.service');

const missionController = {
  getMissions: async (req, res, next) => {
    try {
      const missions = await missionService.getMissions();

      return res.status(200).json(missions);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  getAllMissions: async (req, res, next) => {
    try {
      const missionsWithoutLatLng = await missionService.getAllMissions();

      return res.status(200).json(missionsWithoutLatLng);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  getMission: async (req, res, next) => {
    try {
      const {id} = req.params;

      const mission = await missionService.getMission(id);

      return res.status(200).json(mission);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  getNearMissions: async (req, res, next) => {
    try {
      const {lat, lng} = req.query;

      const nearMissions = await missionService.getNearMissions(lat, lng);

      return res.status(200).json(nearMissions);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  completeMission: async (req, res, next) => {
    try {
      const {lat, lng, key} = req.body;
      const {id} = req.params;
      const {id: userId} = req.auth;

      const mission = await missionService.completeMission(lat, lng, key, id, userId);

      return res.status(200).json(mission);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  createMission: async (req, res, next) => {
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
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  editMission: async (req, res, next) => {
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
  deleteMission: async (req, res, next) => {
    try {
      const {id} = req.params;

      const deletedMission = await missionService.deleteMission(id);

      return res.status(200).json(deletedMission);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
};

module.exports = missionController;
