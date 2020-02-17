const { Router } = require('express');

const { validateRequestQuery, missionValidators } = require('../lib/validators');
const { withAuthorization } = require('../lib/jwt');

const MissionsController = require('../controllers/missions');

const router = Router();

router.get('/all', withAuthorization(MissionsController.getAllMissions));

router.get('/:id', withAuthorization(MissionsController.getMission));

router.get(
  '/',
  validateRequestQuery(
    missionValidators.mission,
    withAuthorization(MissionsController.getNearMissions),
  ),
);

router.post(
  '/:id/complete',
  withAuthorization(MissionsController.completeMission),
);

module.exports = router;
