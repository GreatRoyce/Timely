const express = require("express");

const protect = require("../../middleware/auth.middleware");

const {
  create,
  getAll,
  getOne,
  update,
  remove,
  complete,
} = require("./task.controller");

const router = express.Router();

// All task routes require authentication
router.use(protect);

router.post("/", create);

router.get("/", getAll);

router.get("/:id", getOne);

router.patch("/:id", update);

router.patch("/:id/complete", complete);

router.delete("/:id", remove);

module.exports = router;