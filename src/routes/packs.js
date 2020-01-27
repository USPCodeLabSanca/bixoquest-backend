const { Router } = require('express')

const UserModel = require('../models/user')
const Response = require('../lib/response')
const { withAuthorization } = require('../lib/jwt')

const router = Router()

const NUMBER_OF_STICKERS = 30

router.post(
  '/open',
  withAuthorization(async (req, res) => {
    const { id: userId } = req.auth

    const user = await UserModel.findById(userId)
    if (!user) {
      return Response.failure('Usuário não encontrado', 404).send(res)
    }

    if (user.available_packs < 1) {
      return Response.failure('Sem pacotes disponíveis', 400).send(res)
    }

    const stickerId = Math.floor(Math.random() * NUMBER_OF_STICKERS)
    user.available_packs -= 1
    user.opened_packs += 1
    user.stickers.push(stickerId)
    user.save()

    return Response.success({ sticker_id: stickerId }).send(res)
  })
)

module.exports = router
