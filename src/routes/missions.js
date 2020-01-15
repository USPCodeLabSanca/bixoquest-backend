const { Router } = require('express')

const { isPointWithinRadius } = require('geolib')

const MissionModel = require('../models/mission')
const Response = require('../lib/response')
const { validateRequestQuery, missionValidators } = require('../lib/validators')

const router = Router()

router.get('/all', async (req, res) => {
  const missions = await MissionModel.find()

  return Response.success(missions).send(res)
})

router.get('/:id', async (req, res) => {
  const mission = await MissionModel.findById({ _id: req.params.id })

  if (!mission) {
    return Response.failure(500)
      .send('Não encontrou missão com esse id', 404)
      .send(res)
  }

  return Response.success(mission).send(res)
})

router.get(
  '/',
  validateRequestQuery(missionValidators.mission, async (req, res) => {
    const { lat, lng } = req.query
    const missions = await MissionModel.find()

    const nearMissions = missions.filter(mission => {
      return isPointWithinRadius(
        { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        { latitude: mission.lat, longitude: mission.lng },
        100
      )
    })

    return Response.success(nearMissions).send(res)
  })
)

router.post('/', async (req, res) => {
  const newMission = new MissionModel()

  newMission.title = req.body.title
  newMission.location_reference = req.body.location_reference
  newMission.description = req.body.description
  newMission.number_stickers = req.body.number_stickers
  newMission.lat = req.body.lat
  newMission.lng = req.body.lng
  newMission.available_at = req.body.available_at
  newMission.expirate_at = req.body.expirate_at
  newMission.key = req.body.key
  newMission.type = req.body.type

  await newMission.save()

  return Response.success(newMission).send(res)
})

module.exports = router
