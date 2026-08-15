const express = require("express");

const {
  register,
  login,
  refresh,
  logout,
  forgotPasswordController,
  resetPasswordController,
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

module.exports = router;