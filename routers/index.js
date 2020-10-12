const router = require('express').Router()

const UserRouter = require('./user.router')
const ErrorRouter = require('./error.router')
const SecurityRouter = require('./security')

router.use(SecurityRouter.validateApiKey)
router.use(UserRouter)
router.use(ErrorRouter)

module.exports = router
