const { Router } = require('express')
const authRouter = require('./auth')
const missionRouter = require('./missions')
const packRouter = require('./packs')

const router = Router()

router.use('/auth', authRouter)
router.use('/missions', missionRouter)
router.use('/packs', packRouter)

module.exports = router
