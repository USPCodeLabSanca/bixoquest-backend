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

    let newMission = await missionModel({
        title: req.body.title,
        description: req.body.description,
        number_stickers: req.body.number_stickers,
        lat: req.body.lat,
        lng: req.body.lng,
        available_at: req.body.available_at,
        expirate_at: req.body.expirate_at,
        key: req.body.key,
        type: req.body.type
    })

    res.json(newMission)

})


router.put('/')

router.delete('/')


module.exports = router