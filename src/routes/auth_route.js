const express = require('express')
const createError = require('../utils/create_error')
const auth_controller = require('../controller/auth_controller')
const router = express.Router()
router.post('/register',auth_controller.register)
router.post('/login',auth_controller.login)
module.exports = router