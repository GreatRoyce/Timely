const { z } = require("zod");

// ==========================================
// MongoDB ObjectId
// ==========================================

const objectIdSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid ID"
  );

// ==========================================
// Time
// ==========================================

const timeSchema = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "Time must be in HH:mm format"
  );

// ==========================================
// Date
// ==========================================

const dateSchema = z
  .string()
  .refine(
    (value) => {
      const date = new Date(value);

      return !Number.isNaN(
        date.getTime()
      );
    },
    {
      message: "Invalid due date",
    }
  );

// ==========================================
// Create Task
// ==========================================

const createTaskSchema = z.object({
  customerId:
    objectIdSchema,

  title: z
    .string()
    .trim()
    .min(
      1,
      "Task title is required"
    )
    .max(
      150,
      "Task title cannot exceed 150 characters"
    ),

  dueDate:
    dateSchema,

  dueTime:
    timeSchema,

  priority: z
    .enum([
      "low",
      "medium",
      "high",
    ])
    .default("medium"),

  notes: z
    .string()
    .trim()
    .max(
      2000,
      "Notes cannot exceed 2000 characters"
    )
    .optional(),
});

// ==========================================
// Update Task
// ==========================================

const updateTaskSchema = z
  .object({
    customerId:
      objectIdSchema.optional(),

    title: z
      .string()
      .trim()
      .min(
        1,
        "Task title is required"
      )
      .max(
        150,
        "Task title cannot exceed 150 characters"
      )
      .optional(),

    dueDate:
      dateSchema.optional(),

    dueTime:
      timeSchema.optional(),

    priority: z
      .enum([
        "low",
        "medium",
        "high",
      ])
      .optional(),

    notes: z
      .string()
      .trim()
      .max(
        2000,
        "Notes cannot exceed 2000 characters"
      )
      .optional(),
  })
  .refine(
    (data) =>
      Object.keys(data).length > 0,
    {
      message:
        "At least one field is required",
    }
  );

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};