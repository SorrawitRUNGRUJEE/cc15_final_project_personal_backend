const express = require('express')
const authenticate = require('../middlewares/authenticate')
const store_controller = require('../controller/store_controller')

const router = express.Router()

router.get('/product', store_controller.getAllProduct)
router.get('/product/:id', store_controller.getProductById)
router.get('/category', store_controller.getAllCategory)
router.get('/picture',store_controller.getAllPhoto)
router.get('/category/:id',  store_controller.getSingleCategory)
router.post('/picture/main', authenticate, store_controller.setMainPhotoForProduct)
router.post('/picture/second', authenticate, store_controller.setSecondaryPhotoForProduct)
router.get('/picture/:productId',authenticate, store_controller.getPhotoByProductId)

module.exports = router