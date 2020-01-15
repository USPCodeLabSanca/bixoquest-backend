const { Router } = require('express')

const { isPointWithinRadius } = require('geolib')

const MissionModel = require('../models/mission')
const Response = require('../lib/response')
const { validateRequest, missionValidators } = require('../lib/validators')

const router = Router()

router.get(
  '/',
  validateRequest(missionValidators.mission, async (req, res) => {
    const { lat, lng } = req.body
    const missions = await MissionModel.find()

    const nearMissions = []

    for (const mission of missions) {
      if (
        isPointWithinRadius(
          { latitude: lat, longitude: lng },
          { latitude: mission.lat, longitude: mission.lng },
          100
        )
      ) {
        nearMissions.push(mission)
      }
    }

    Response.success(nearMissions).send(res)
  })
)

router.get(
  '/all',
  async (req, res) => {
    const missions = await MissionModel.find()

    Response.success(missions).send(res)
  }
)

router.get('/:id', async (req, res) => {
  const mission = await MissionModel.findById({ _id: req.params.id })

  if (!mission) {
    Response.failure(500)
      .send('Não encontrou missão com esse id', 404)
      .send(res)
  }

  Response.success(mission).send(res)
})

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

  Response.success(newMission).send(res)
})

module.exports = router
