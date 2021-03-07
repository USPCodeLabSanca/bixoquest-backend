const { Router } = require('express');

const { withAuthorization } = require('../lib/jwt');

const MissionsController = require('../controllers/mission.controller');

const router = Router();

router.get('/all', withAuthorization(MissionsController.getAllMissions));

router.get('/:id', withAuthorization(MissionsController.getMission));

router.get('/', withAuthorization(MissionsController.getNearMissions));

router.post(
  '/:id/complete',
  withAuthorization(MissionsController.completeMission),
);

module.exports = router;
