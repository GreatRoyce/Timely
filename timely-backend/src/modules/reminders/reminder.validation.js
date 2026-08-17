const { z } = require("zod");

// ==========================================
// MongoDB ObjectId
// ==========================================

const objectIdSchema = z
  .string()
  .trim()
  .regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid task ID"
  );

// ==========================================
// Reminder Date
// ==========================================

const remindAtSchema = z
  .string()
  .datetime({
    message:
      "Please provide a valid reminder date and time",
  })
  .refine(
    (value) =>
      new Date(value).getTime() >
      Date.now(),
    {
      message:
        "Reminder time must be in the future",
    }
  );

// ==========================================
// Create Reminder
// ==========================================

const createReminderSchema =
  z.object({
    taskId:
      objectIdSchema,

    remindAt:
      remindAtSchema,
  });

// ==========================================
// Update Reminder
// ==========================================

const updateReminderSchema =
  z.object({
    remindAt:
      remindAtSchema.optional(),
  }).refine(
    (data) =>
      data.remindAt !== undefined,
    {
      message:
        "Reminder time is required",
    }
  );

module.exports = {
  createReminderSchema,
  updateReminderSchema,
};