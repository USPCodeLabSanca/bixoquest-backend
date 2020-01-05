const { Router } = require('express')

const Response = require('../lib/response')
const UserModel = require('../models/user')

const router = Router()

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const user = await UserModel.findOne({ _id: id })
  if (!user) return Response.failure('User not found', 404).send(res)
  const stickers = user.stickers
  Response.success(stickers).send(res)
})

module.exports = router
