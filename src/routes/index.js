const { Router } = require('express')
const authRouter = require('./auth')
const missionRouter = require('./missions')

const router = Router()

router.use('/auth', authRouter)
router.use('/missions', missionRouter)

module.exports = router
