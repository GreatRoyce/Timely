const { z } = require("zod");

// ==========================================
// Create Reminder
// ==========================================

const createReminderSchema = z.object({
  taskId: z
    .string()
    .trim()
    .min(1, "Task is required"),

  remindAt: z
    .string()
    .datetime({
      message:
        "Please provide a valid reminder date and time",
    }),
});

// ==========================================
// Update Reminder
// ==========================================

const updateReminderSchema = z.object({
  remindAt: z
    .string()
    .datetime({
      message:
        "Please provide a valid reminder date and time",
    })
    .optional(),
});

module.exports = {
  createReminderSchema,
  updateReminderSchema,
};