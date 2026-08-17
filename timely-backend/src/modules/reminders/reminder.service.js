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

  // ------------------------------------------
  // Verify Task Ownership
  // ------------------------------------------

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

  // ------------------------------------------
  // Task Status
  // ------------------------------------------

  if (
    task.status === "completed" ||
    task.status === "cancelled"
  ) {
    throw new AppError(
      "Cannot create a reminder for a completed or cancelled task",
      400
    );
  }

  // ------------------------------------------
  // Prevent Duplicate Reminder
  // ------------------------------------------

  const existingReminder =
    await Reminder.findOne({
      userId,
      taskId,
      remindAt,
      status: {
        $in: [
          "scheduled",
          "processing",
          "sent",
        ],
      },
    });

  if (existingReminder) {
    throw new AppError(
      "A reminder already exists for this task at this time",
      409
    );
  }

  // ------------------------------------------
  // Create Reminder
  // ------------------------------------------

  const reminder =
    await Reminder.create({
      userId,
      taskId,
      remindAt,
    });

  return reminder;
};

// ==========================================
// Get All Reminders
// ==========================================

const getReminders = async (
  userId
) => {
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

  // Don't allow modification after
  // processing has started.
  if (
    reminder.status === "processing" ||
    reminder.status === "sent"
  ) {
    throw new AppError(
      "Processed reminders cannot be modified",
      400
    );
  }

  if (
    reminder.status === "cancelled"
  ) {
    throw new AppError(
      "Cancelled reminders cannot be modified",
      400
    );
  }

  // ------------------------------------------
  // Prevent Duplicate Reminder
  // ------------------------------------------

  if (reminderData.remindAt) {
    const existingReminder =
      await Reminder.findOne({
        _id: {
          $ne: reminder._id,
        },
        userId,
        taskId: reminder.taskId,
        remindAt:
          reminderData.remindAt,
        status: {
          $in: [
            "scheduled",
            "processing",
            "sent",
          ],
        },
      });

    if (existingReminder) {
      throw new AppError(
        "A reminder already exists for this task at this time",
        409
      );
    }
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

  if (
    reminder.status === "sent" ||
    reminder.status === "processing"
  ) {
    throw new AppError(
      "Processed reminders cannot be cancelled",
      400
    );
  }

  if (
    reminder.status === "cancelled"
  ) {
    throw new AppError(
      "Reminder is already cancelled",
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