const asyncHandler = require("../../utils/asyncHandler");

const {
  getNotifications,
  getNotificationById,
} = require("./notification.service");

// ==========================================
// Get All Notifications
// ==========================================

const getAll = asyncHandler(
  async (req, res) => {
    const result =
      await getNotifications(
        req.user.userId,
        req.query
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  }
);

// ==========================================
// Get Single Notification
// ==========================================

const getOne = asyncHandler(
  async (req, res) => {
    const notification =
      await getNotificationById(
        req.user.userId,
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: {
        notification,
      },
    });
  }
);

module.exports = {
  getAll,
  getOne,
};