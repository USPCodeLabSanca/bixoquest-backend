const { Router } = require('express');

const MissionsController = require('../../controllers/missions');

const router = Router();

router.get('/', MissionsController.getMissions);

router.get('/:id', MissionsController.getMission);

router.post('/', MissionsController.createMission);

router.put('/:id', MissionsController.editMission);

router.delete('/:id', MissionsController.deleteMission);

module.exports = router;
