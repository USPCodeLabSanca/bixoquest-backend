const { Router } = require('express')
const missionModel = require('../models/mission') 
const Response = require('../lib/response')

const router = Router();

router.get('/', async (req, res) => {
  const missions = await missionModel.find()

  Response.success(missions).send(res)
})

router.get('/:id', async (req,res) => {
  const mission = await missionModel.findById({ _id: req.params.id })

  if(!mission){
    Response.failure(500).send('Não encontrou missão com esse id', 404).send(res)
  }

  Response.success(mission).send(res)
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

  await newMission.save()
  
  Response.success(newMission).send(res)
})

module.exports = router