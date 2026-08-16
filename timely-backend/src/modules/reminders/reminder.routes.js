const express = require("express");

const protect = require("../../middleware/auth.middleware");

const {
  create,
  getAll,
  getOne,
  update,
  cancel,
  remove,
} = require("./reminder.controller");

const router = express.Router();

router.use(protect);

router.post("/", create);

router.get("/", getAll);

router.get("/:id", getOne);

router.patch("/:id", update);

router.patch("/:id/cancel", cancel);

router.delete("/:id", remove);

module.exports = router;