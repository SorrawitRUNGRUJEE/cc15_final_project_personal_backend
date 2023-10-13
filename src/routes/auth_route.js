const express = require('express')
const authenticate = require('../middlewares/authenticate')
const auth_controller = require('../controller/auth_controller')
const router = express.Router()
router.post('/register',auth_controller.register)
router.post('/login',auth_controller.login)
router.get('/user',authenticate,auth_controller.getUser)
module.exports = router