const { Router } = require('express');

const MissionsController = require('../../controllers/mission.controller');
const { withAuthorization } = require('../../lib/jwt');

const router = Router();

router.get('/', withAuthorization(MissionsController.getMissions, true));

router.get('/:id', withAuthorization(MissionsController.getMission, true));

router.post('/', withAuthorization(MissionsController.createMission, true));

router.put('/:id', withAuthorization(MissionsController.editMission, true));

router.delete('/:id', withAuthorization(MissionsController.deleteMission, true));

module.exports = router;
