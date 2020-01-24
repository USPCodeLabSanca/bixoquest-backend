const { Router } = require('express')

const { default: Axios } = require('axios')

const Response = require('../lib/response')
const { validateRequest, authValidators } = require('../lib/validators')
const UserModel = require('../models/user')
const UserUspModel = require('../models/user-usp')
const jwt = require('../lib/jwt')

const router = Router()

// Login user
router.post(
  '/mock-auth-usp',
  validateRequest(authValidators.mockAuthUsp, async (req, res) => {
    const { nusp, password } = req.body

    const user = await UserUspModel.findOne({ nusp })

    if (!user) {
      return Response.failure('Invalid credentials', 401).send(res)
    }
    if (user.password !== password) {
      return Response.failure('Invalid credentials', 401).send(res)
    }

    delete user.password

    Response.success(user).send(res)
  })
)

// Login user
router.post(
  '/',
  validateRequest(authValidators.mockAuthUsp, async (req, res) => {
    let response
    try {
      response = await Axios.post(
        'http://localhost:8080/auth/mock-auth-usp',
        req.body
      )
    } catch (e) {
      const { response } = e
      if (!response) {
        return Response.failure(undefined, 500).send(res)
      } else {
        return Response.failure(response.data.message, response.status).send(
          res
        )
      }
    }
    const user = response.data.data
    const dbUser = await UserModel.findOne({ nusp: user.nusp })

    if (!dbUser) {
      await UserModel.create(user)
    }
    user.token = jwt.create({ id: user._id })

    Response.success(user).send(res)
  })
)

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
