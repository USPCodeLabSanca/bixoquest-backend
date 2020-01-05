const { Router } = require('express')
const authRouter = require('./auth')
const stickerRouter = require('./stickers')

const router = Router()

router.use('/auth', authRouter)
router.use('/sticker', stickerRouter)

module.exports = router
