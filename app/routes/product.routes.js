const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");
const ProductImage = require("../middleware/fileUploades");
router.post(
  "/create",
  ProductImage.single("image"),
  productController.createProduct,
);
router.get("/get", productController.getProduct);
router.get("/get/:id", productController.getSingleProduct);
router.put(
  "/edit/:id",
  ProductImage.single("image"),
  productController.updateProduct,
);
router.patch("/restore/:id", productController.restoreProduct);
router.delete("/delete/:id", productController.deleteProduct);
router.delete("/softdelete/:id", productController.softDeleteProduct);
module.exports = router;
