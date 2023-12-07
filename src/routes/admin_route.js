const express = require("express");
const admin_controller = require("../controller/admin_controller");
const authenticate = require("../middlewares/authenticate");
const upload_middleware = require("../middlewares/upload");
const router = express.Router();
router.get('/',authenticate,admin_controller.getAllAdmin)
router.post("/", authenticate, admin_controller.addAdmin);
router.delete("/remove/:id/:username", authenticate, admin_controller.removeAdmin);
router.get("/product", authenticate, admin_controller.getProduct);
router.post("/product", authenticate, admin_controller.addProduct);
router.patch("/product", authenticate, admin_controller.modifyProduct);
router.delete("/product/:id/:title", authenticate, admin_controller.deleteProduct);
router.get('/category',authenticate,admin_controller.getCategory)
router.post("/category", authenticate, admin_controller.addCategory);
router.patch("/category", authenticate, admin_controller.modifyCategory);
router.delete("/category/:id/:name", authenticate, admin_controller.deleteCategory);
router.post("/product/category",authenticate, admin_controller.addProductCategory);
router.delete("/product/category/:productId/:productTitle/:categoryId/:categoryName",authenticate, admin_controller.deleteProductCategory);
router.get('/product/picture',authenticate,admin_controller.getAllPhoto)
router.post('/product/picture/:productId/:productTitle', authenticate, upload_middleware.array('productPicture',10),admin_controller.addProductPhoto)
router.delete('/product/picture/:photoId/:id/:title',authenticate, admin_controller.deleteProductPhoto)
router.get('/payment',authenticate,admin_controller.getOrder)
router.post('/approve',authenticate,admin_controller.approvePayment)
router.delete('/decline/:deId',authenticate,admin_controller.declinePayment)
module.exports = router;
