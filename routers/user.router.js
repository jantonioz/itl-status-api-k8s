'use strict'
const router = require('express').Router()
const UserController = require('../controllers/user.controller')
const UserMiddleware = require('../middlewares/user.middleware')

router.get('/users', UserMiddleware.get, UserController.get)
router.get('/users/status', UserMiddleware.getStatus, UserController.getStatus)
router.post('/users', UserMiddleware.create, UserController.create)
router.put('/users', UserMiddleware.update, UserController.update)
router.put('/users/status', UserMiddleware.updateStatus, UserController.updateStatus)
router.delete('/users', UserMiddleware.delete, UserController.delete)

module.exports = router