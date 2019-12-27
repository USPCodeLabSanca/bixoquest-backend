const { Router } = require('express')

const Response = require('../lib/response')
const { validateRequest, authValidators } = require('../lib/validators')
const UserModel = require('../models/user')

const router = Router()

// Create user
router.post('/mock-auth-usp', validateRequest(authValidators.mockAuthUsp, async (req, res) => {
  const { nusp, password } = req.body
  const user = await UserModel.findOne({ nusp })
  if (!user) {
    return Response.failure('Invalid credentials', 401).send(res)
  }
  if (user.password !== password) {
    return Response.failure('Invalid credentials', 401).send(res)
  }
  Response.success(user).send(res)
}))

// Login user
router.post('/login', validateRequest(authValidators.login, async (req, res) => {
  Response.success().send(res)
}))

// get user - user privileges
router.get('/', (req, res) => {
  Response.success().send(res)
})

// delete user - user privileges
router.delete('/', (req, res) => {
  Response.success().send(res)
})

// patch user - user privileges
router.patch('/', (req, res) => {
  Response.success().send(res)
})

module.exports = router
