const AppError = require("../../utils/AppError");

const Notification = require("./notification.model");
const Reminder = require("../reminders/reminder.model");
const Task = require("../tasks/task.model");
const User = require("../users/user.model");

const {
  sendTaskReminderEmail,
} = require("../../services/email.service");

// ==========================================
// Send Task Reminder
// ==========================================

const sendTaskReminder = async (reminderId) => {
  const reminder = await Reminder.findOne({
    _id: reminderId,
    status: "processing",
  });

  if (!reminder) {
    throw new AppError(
      "Processing reminder not found",
      404
    );
  }

  // ==========================================
  // Get Task
  // ==========================================

  const task = await Task.findOne({
    _id: reminder.taskId,
    userId: reminder.userId,
  }).populate(
    "customerId",
    "name phone"
  );

  if (!task) {
    throw new AppError(
      "Task not found",
      404
    );
  }

  // ==========================================
  // Make Sure Task Is Still Active
  // ==========================================

  if (
    task.status === "completed" ||
    task.status === "cancelled"
  ) {
    reminder.status = "cancelled";
    reminder.errorMessage =
      "Task is completed or cancelled";

    await reminder.save();

    return null;
  }

  // ==========================================
  // Get User
  // ==========================================

  const user = await User.findById(
    reminder.userId
  );

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  // ==========================================
  // Create Notification Record
  // ==========================================

  const notification =
    await Notification.create({
      userId: user._id,
      taskId: task._id,
      reminderId: reminder._id,
      type: "task_reminder",
      channel: "email",
      recipient: user.email,
      subject: `Reminder: ${task.title}`,
      message: `Your task "${task.title}" is due at ${task.dueTime}.`,
      status: "pending",
    });

  // ==========================================
  // Send Email
  // ==========================================

  try {
    await sendTaskReminderEmail({
      email: user.email,
      ownerName: user.ownerName,
      taskTitle: task.title,
      customerName:
        task.customerId?.name ||
        "Customer",
      dueDate:
        task.dueDate
          .toISOString()
          .split("T")[0],
      dueTime: task.dueTime,
      priority: task.priority,
    });

    // ----------------------------------------
    // Mark Notification as Sent
    // ----------------------------------------

    notification.status = "sent";
    notification.sentAt = new Date();

    await notification.save();

    // ----------------------------------------
    // Mark Reminder as Sent
    // ----------------------------------------

    reminder.status = "sent";
    reminder.sentAt = new Date();

    await reminder.save();

    return notification;
  } catch (error) {
    // ----------------------------------------
    // Mark Notification as Failed
    // ----------------------------------------

    notification.status = "failed";
    notification.failedAt = new Date();
    notification.errorMessage =
      error.message;

    await notification.save();

    throw error;
  }
};

// ==========================================
// Get Notifications
// ==========================================

const getNotifications = async (
  userId,
  filters = {}
) => {
  const {
    status,
    page = 1,
    limit = 20,
  } = filters;

  const query = {
    userId,
  };

  // ------------------------------------------
  // Status Filter
  // ------------------------------------------

  if (status) {
    query.status = status;
  }

  // ------------------------------------------
  // Pagination
  // ------------------------------------------

  const currentPage = Math.max(
    Number(page) || 1,
    1
  );

  const perPage = Math.min(
    Math.max(
      Number(limit) || 20,
      1
    ),
    100
  );

  const skip =
    (currentPage - 1) *
    perPage;

  // ------------------------------------------
  // Query
  // ------------------------------------------

  const [
    notifications,
    total,
  ] = await Promise.all([
    Notification.find(query)
      .populate(
        "taskId",
        "title dueDate dueTime priority"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(perPage),

    Notification.countDocuments(
      query
    ),
  ]);

  // ------------------------------------------
  // Response
  // ------------------------------------------

  return {
    notifications,

    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(
        total / perPage
      ),
    },
  };
};

// ==========================================
// Get Single Notification
// ==========================================

const getNotificationById = async (
  userId,
  notificationId
) => {
  const notification =
    await Notification.findOne({
      _id: notificationId,
      userId,
    }).populate(
      "taskId",
      "title dueDate dueTime priority"
    );

  if (!notification) {
    throw new AppError(
      "Notification not found",
      404
    );
  }

  return notification;
};

// ==========================================
// Exports
// ==========================================

module.exports = {
  sendTaskReminder,
  getNotifications,
  getNotificationById,
};