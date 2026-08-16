const asyncHandler = require("../../utils/asyncHandler");

const {
  getDashboard,
} = require("./dashboard.service");

const getOverview = asyncHandler(
  async (req, res) => {
    const dashboard = await getDashboard(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  }
);

module.exports = {
  getOverview,
};