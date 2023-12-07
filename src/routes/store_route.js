const express = require('express')
const authenticate = require('../middlewares/authenticate')
const store_controller = require('../controller/store_controller')
const upload = require('../middlewares/upload')

const router = express.Router()

router.get('/product', store_controller.getAllProduct)
router.get('/product/:id', store_controller.getProductById)
router.get('/category', store_controller.getAllCategory)
router.get('/picture',store_controller.getAllPhoto)
router.get('/category/:id',  store_controller.getSingleCategory)
router.post('/picture/main/:productId/:pictureId', authenticate, store_controller.setMainPhotoForProduct)
router.post('/picture/second/:productId/:pictureId', authenticate, store_controller.setSecondaryPhotoForProduct)
router.get('/picture/:productId',authenticate, store_controller.getPhotoByProductId)
router.get('/basket',store_controller.getBasket)
router.post("/basket/:productId",authenticate,store_controller.addToBasket)
router.delete('/basket/:productId',authenticate,store_controller.deleteSingleBasket)
router.delete('/basket',authenticate,store_controller.deleteAllBasket)
router.post('/order',authenticate,store_controller.createOrder)
router.get('/order',authenticate,store_controller.getOrder)
router.post('/payment',authenticate, upload.single("paymentSlip"),store_controller.submitPayment)

module.exports = router