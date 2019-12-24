const { Router } = require('express')
const Response = require('../lib/response')

const router = Router()

// Create user
router.post('/', async (req, res) => {
  Response.success().send(res)
})

// Login user
router.post('/login', async (req, res) => {
  Response.success().send(res)
})

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
