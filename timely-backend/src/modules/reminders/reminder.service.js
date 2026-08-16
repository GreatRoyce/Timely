const AppError = require("../../utils/AppError");

const Reminder = require("./reminder.model");
const Task = require("../tasks/task.model");

// ==========================================
// Create Reminder
// ==========================================

const createReminder = async (
  userId,
  reminderData
) => {
  const {
    taskId,
    remindAt,
  } = reminderData;

  // Make sure the task belongs
  // to the authenticated user.
  const task = await Task.findOne({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new AppError(
      "Task not found",
      404
    );
  }

  // Prevent reminders from being created
  // for completed or cancelled tasks.
  if (
    task.status === "completed" ||
    task.status === "cancelled"
  ) {
    throw new AppError(
      "Cannot create a reminder for a completed or cancelled task",
      400
    );
  }

  const reminder = await Reminder.create({
    userId,
    taskId,
    remindAt,
  });

  return reminder;
};

// ==========================================
// Get All Reminders
// ==========================================

const getReminders = async (userId) => {
  const reminders =
    await Reminder.find({
      userId,
    })
      .populate(
        "taskId",
        "title dueDate dueTime priority status customerId"
      )
      .sort({
        remindAt: 1,
      });

  return reminders;
};

// ==========================================
// Get Single Reminder
// ==========================================

const getReminderById = async (
  userId,
  reminderId
) => {
  const reminder =
    await Reminder.findOne({
      _id: reminderId,
      userId,
    }).populate(
      "taskId",
      "title dueDate dueTime priority status customerId"
    );

  if (!reminder) {
    throw new AppError(
      "Reminder not found",
      404
    );
  }

  return reminder;
};

// ==========================================
// Update Reminder
// ==========================================

const updateReminder = async (
  userId,
  reminderId,
  reminderData
) => {
  const reminder =
    await Reminder.findOne({
      _id: reminderId,
      userId,
    });

  if (!reminder) {
    throw new AppError(
      "Reminder not found",
      404
    );
  }

  // Don't allow modification of reminders
  // that have already been sent.
  if (reminder.status === "sent") {
    throw new AppError(
      "Sent reminders cannot be modified",
      400
    );
  }

  Object.assign(
    reminder,
    reminderData
  );

  await reminder.save();

  return reminder;
};

// ==========================================
// Cancel Reminder
// ==========================================

const cancelReminder = async (
  userId,
  reminderId
) => {
  const reminder =
    await Reminder.findOne({
      _id: reminderId,
      userId,
    });

  if (!reminder) {
    throw new AppError(
      "Reminder not found",
      404
    );
  }

  if (reminder.status === "sent") {
    throw new AppError(
      "Sent reminders cannot be cancelled",
      400
    );
  }

  reminder.status = "cancelled";

  await reminder.save();

  return reminder;
};

// ==========================================
// Delete Reminder
// ==========================================

const deleteReminder = async (
  userId,
  reminderId
) => {
  const reminder =
    await Reminder.findOneAndDelete({
      _id: reminderId,
      userId,
    });

  if (!reminder) {
    throw new AppError(
      "Reminder not found",
      404
    );
  }

  return reminder;
};

module.exports = {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  cancelReminder,
  deleteReminder,
};