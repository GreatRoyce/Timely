const express = require("express");

const protect = require("../../middleware/auth.middleware");
const validateObjectId = require("../../middleware/validateObjectId");

const {
  getAll,
  getOne,
} = require("./notification.controller");

const router = express.Router();

// ==========================================
// All Notification Routes Require Auth
// ==========================================

router.use(protect);

// ==========================================
// Get All Notifications
// ==========================================

router.get(
  "/",
  getAll
);

// ==========================================
// Get Single Notification
// ==========================================

router.get(
  "/:id",
  validateObjectId(),
  getOne
);

module.exports = router;