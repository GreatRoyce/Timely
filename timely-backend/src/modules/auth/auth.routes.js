const express = require("express");

const protect = require("../../middleware/auth.middleware");

const {
  register,
  login,
  refresh,
  logout,
  forgotPasswordController,
  resetPasswordController,
  getMe,
} = require("./auth.controller");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.post(
  "/forgot-password",
  forgotPasswordController
);

router.post(
  "/reset-password",
  resetPasswordController
);

// Protected route
router.get("/me", protect, getMe);

module.exports = router;