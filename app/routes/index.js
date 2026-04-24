const express = require("express");
const router = express.Router();
const ProductRoutes = require("./product.routes");
const AuthRoutes = require("./auth.routes");

router.use("/api/products", ProductRoutes);
router.use("/api/auth", AuthRoutes);

module.exports = router;
