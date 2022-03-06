import createError from 'http-errors';

import missionService from '../services/mission.service';

export default {
  // App
  getAllMissions: async (req: any, res: any, next: any) => {
    try {
      const missionsWithoutLatLngKey = await missionService.getAllMissions();

      return res.status(200).json(missionsWithoutLatLngKey);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  getNearMissions: async (req: any, res: any, next: any) => {
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
  completeMission: async (req: any, res: any, next: any) => {
    try {
      const {lat, lng, key} = req.body;
      const {id} = req.params;
      const user = req.user;

      const mission = await missionService.completeMission(lat, lng, key, id, user);

      return res.status(200).json(mission);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  // Backoffice
  getMissions: async (req: any, res: any, next: any) => {
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
  getMission: async (req: any, res: any, next: any) => {
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
  createMission: async (req: any, res: any, next: any) => {
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
        isSpecial,
        minimumOfUsersToComplete,
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
          isSpecial,
          minimumOfUsersToComplete,
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
  editMission: async (req: any, res: any, next: any) => {
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
        isSpecial,
        minimumOfUsersToComplete,
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
          isSpecial,
          minimumOfUsersToComplete,
      );

      return res.status(200).json(editedMission);
    } catch (error) {
      console.log(error);

      if (!createError.isHttpError(error)) {
        error = new createError.InternalServerError('Erro no servidor.');
      }

      return next(error);
    }
  },
  deleteMission: async (req: any, res: any, next: any) => {
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
