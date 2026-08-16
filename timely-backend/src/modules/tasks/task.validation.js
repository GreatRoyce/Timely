const { z } = require("zod");

const createTaskSchema = z.object({
  customerId: z
    .string()
    .trim()
    .min(1, "Customer is required"),

  title: z
    .string()
    .trim()
    .min(2, "Task title is required")
    .max(150, "Task title cannot exceed 150 characters"),

  dueDate: z
    .string()
    .trim()
    .min(1, "Due date is required"),

  dueTime: z
    .string()
    .trim()
    .regex(
      /^(?:[01]\d|2[0-3]):[0-5]\d$/,
      "Due time must be in HH:mm format"
    ),

  priority: z
    .enum(["low", "medium", "high"])
    .default("medium"),

  notes: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

const updateTaskSchema = z.object({
  customerId: z
    .string()
    .trim()
    .min(1)
    .optional(),

  title: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .optional(),

  dueDate: z
    .string()
    .trim()
    .min(1)
    .optional(),

  dueTime: z
    .string()
    .trim()
    .regex(
      /^(?:[01]\d|2[0-3]):[0-5]\d$/,
      "Due time must be in HH:mm format"
    )
    .optional(),

  priority: z
    .enum(["low", "medium", "high"])
    .optional(),

  notes: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal("")),

  status: z
    .enum([
      "pending",
      "in_progress",
      "completed",
      "cancelled",
    ])
    .optional(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};