const express = require('express')
const admin_controller = require('../controller/admin_controller')
const authenticate = require('../middlewares/authenticate')
const router = express.Router()

router.post('/registration', authenticate, admin_controller.addAdmin)
router.delete('/registration', authenticate, admin_controller.removeAdmin)
 




module.exports=  router