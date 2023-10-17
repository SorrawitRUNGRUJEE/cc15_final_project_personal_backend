const express = require("express");
const admin_controller = require("../controller/admin_controller");
const authenticate = require("../middlewares/authenticate");
const upload_middleware = require("../middlewares/upload");
const router = express.Router();

router.post("/registration", authenticate, admin_controller.addAdmin);
router.delete("/registration", authenticate, admin_controller.removeAdmin);
router.get("/product", authenticate, admin_controller.getProduct);
router.post("/product", authenticate, admin_controller.addProduct);
router.patch("/product", authenticate, admin_controller.modifyProduct);
router.delete("/product", authenticate, admin_controller.deleteProduct);
router.post("/category", authenticate, admin_controller.addCategory);
router.patch("/category", authenticate, admin_controller.modifyCategory);
router.delete("/category", authenticate, admin_controller.deleteCategory);
router.post("/product/category",authenticate, admin_controller.addProductCategory);

router.delete("/product/category",authenticate, admin_controller.deleteProductCategory);

module.exports = router;
