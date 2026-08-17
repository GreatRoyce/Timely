const express = require("express");

const protect = require("../../middleware/auth.middleware");
const validateObjectId = require("../../middleware/validateObjectId");

const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("./customer.controller");

const router = express.Router();

router.use(protect);

router.post("/", create);

router.get("/", getAll);

router.get(
  "/:id",
  validateObjectId(),
  getOne
);

router.patch(
  "/:id",
  validateObjectId(),
  update
);

router.delete(
  "/:id",
  validateObjectId(),
  remove
);

module.exports = router;