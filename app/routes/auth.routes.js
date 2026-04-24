const express = require("express");
const authController = require("../controller/auth.controller");
const AuthCheck = require("../middleware/auth");
const ProductImage = require("../middleware/fileUploades");
const router = express.Router();

router.post(
  "/register",
  ProductImage.single("profileImage"),
  authController.register,
);
router.post("/login", authController.login);
router.get("/profile", AuthCheck, authController.profile);
router.put(
  "/edit",
  AuthCheck,
  ProductImage.single("profileImage"),
  authController.updateProfile,
);
module.exports = router;
