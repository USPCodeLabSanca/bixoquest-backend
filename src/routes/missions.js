const { Router } = require('express')
const missionModel = require('../models/mission') 

const router = Router();


router.get('/', async (req, res) => {

    let missions = await missionModel.find()

    res.json(missions)
})

router.get('/:id', async (req,res) => {

    let mission = await missionModel.findById({ _id: req.query.id })

    if(!mission){
        res.status(500).send('Não encontrou missão com esse id')
    }

    res.json(mission)

})


router.post('/', async (req,res) => {


    let newMission = new missionModel()

    newMission.title = req.body.title
    newMission.description = req.body.description
    newMission.number_stickers = req.body.number_stickers
    newMission.lat = req.body.lat,
    newMission.lng = req.body.lng;
    newMission.available_at = req.body.available_at
    newMission.expirate_at = req.body.expirate_at
    newMission.key = req.body.key
    newMission.type = req.body.type 

    const missionCreated = newMission.save()

    res.json(newMission)

})


router.put('/')

router.delete('/')


module.exports = router