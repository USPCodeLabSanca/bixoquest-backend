const { Router } = require('express')

const UserModel = require('../models/user')
const Response = require('../lib/response')
const { withAuthorization } = require('../lib/jwt')

const router = Router()

const NUMBER_OF_STICKERS = 30

router.post(
  '/packs/open',
  withAuthorization(async (req, res) => {
    const { id: userId } = req.auth

    const user = await UserModel.findById(userId)
    if (!user) {
      return Response.failure('User not found', 400).send(res)
    }

    if (user.packs > 0) {
      user.packs -= 1
      user.stickers.push(Math.floor(Math.random() * Math.floor(NUMBER_OF_STICKERS)))
      user.save()
      return Response.success(user).send(res)
    }

    return Response.failure('Mission type error', 400).send(res)
  })
)

module.exports = router
