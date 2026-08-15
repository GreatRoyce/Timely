const express = require("express");
const protect = require("../middleware/auth.middleware");

const createNotImplementedRouter = (featureName) => {
  const router = express.Router();

  router.use(protect);
  router.use((req, res) => {
    res.status(501).json({
      success: false,
      message: `${featureName} API is not implemented yet`,
    });
  });

  return router;
};

module.exports = createNotImplementedRouter;
