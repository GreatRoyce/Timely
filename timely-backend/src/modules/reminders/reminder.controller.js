const asyncHandler = require("../../utils/asyncHandler");

const {
  createReminderSchema,
  updateReminderSchema,
} = require("./reminder.validation");

const {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  cancelReminder,
  deleteReminder,
} = require("./reminder.service");

// ==========================================
// Create Reminder
// ==========================================

const create = asyncHandler(async (req, res) => {
  const data = createReminderSchema.parse(
    req.body
  );

  const reminder = await createReminder(
    req.user.userId,
    data
  );

  res.status(201).json({
    success: true,
    message: "Reminder created successfully",
    data: {
      reminder,
    },
  });
});

// ==========================================
// Get All Reminders
// ==========================================

const getAll = asyncHandler(async (req, res) => {
  const reminders = await getReminders(
    req.user.userId
  );

  res.status(200).json({
    success: true,
    data: {
      reminders,
    },
  });
});

// ==========================================
// Get Single Reminder
// ==========================================

const getOne = asyncHandler(async (req, res) => {
  const reminder =
    await getReminderById(
      req.user.userId,
      req.params.id
    );

  res.status(200).json({
    success: true,
    data: {
      reminder,
    },
  });
});

// ==========================================
// Update Reminder
// ==========================================

const update = asyncHandler(async (req, res) => {
  const data = updateReminderSchema.parse(
    req.body
  );

  const reminder =
    await updateReminder(
      req.user.userId,
      req.params.id,
      data
    );

  res.status(200).json({
    success: true,
    message: "Reminder updated successfully",
    data: {
      reminder,
    },
  });
});

// ==========================================
// Cancel Reminder
// ==========================================

const cancel = asyncHandler(async (req, res) => {
  const reminder =
    await cancelReminder(
      req.user.userId,
      req.params.id
    );

  res.status(200).json({
    success: true,
    message: "Reminder cancelled successfully",
    data: {
      reminder,
    },
  });
});

// ==========================================
// Delete Reminder
// ==========================================

const remove = asyncHandler(async (req, res) => {
  await deleteReminder(
    req.user.userId,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Reminder deleted successfully",
  });
});

module.exports = {
  create,
  getAll,
  getOne,
  update,
  cancel,
  remove,
};