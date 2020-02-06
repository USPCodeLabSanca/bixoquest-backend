const { Router } = require('express');

const { validateRequestQuery, missionValidators } = require('../lib/validators');
const { withAuthorization } = require('../lib/jwt');

const MissionsController = require('../controllers/missions');

const router = Router();

router.get('/all', MissionsController.getAllMissions);

router.get('/:id', MissionsController.getMission);

router.get(
  '/',
  validateRequestQuery(missionValidators.mission, MissionsController.getNearMissions),
);

router.post(
  '/:id/complete',
  withAuthorization(MissionsController.completeMission),
);

module.exports = router;
