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
    status: "scheduled",
  });

  if (!reminder) {
    throw new AppError(
      "Scheduled reminder not found",
      404
    );
  }

  // Get the task
  const task = await Task.findOne({
    _id: reminder.taskId,
    userId: reminder.userId,
  }).populate("customerId", "name phone");

  if (!task) {
    throw new AppError(
      "Task not found",
      404
    );
  }

  // Get the business owner
  const user = await User.findById(
    reminder.userId
  );

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  // Create notification record first
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

  try {
    await sendTaskReminderEmail({
      email: user.email,
      ownerName: user.ownerName,
      taskTitle: task.title,
      customerName:
        task.customerId?.name || "Customer",
      dueDate: task.dueDate.toISOString().split("T")[0],
      dueTime: task.dueTime,
      priority: task.priority,
    });

    notification.status = "sent";
    notification.sentAt = new Date();

    await notification.save();

    reminder.status = "sent";
    reminder.sentAt = new Date();

    await reminder.save();

    return notification;
  } catch (error) {
    notification.status = "failed";
    notification.failedAt = new Date();
    notification.errorMessage =
      error.message;

    await notification.save();

    throw error;
  }
};

module.exports = {
  sendTaskReminder,
};