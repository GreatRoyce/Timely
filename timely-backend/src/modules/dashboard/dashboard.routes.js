const express = require("express");

const protect = require("../../middleware/auth.middleware");

const {
  getOverview,
} = require("./dashboard.controller");

const router = express.Router();

router.use(protect);

router.get("/", getOverview);

module.exports = router;