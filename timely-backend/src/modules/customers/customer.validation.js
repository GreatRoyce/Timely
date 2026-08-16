const { z } = require("zod");

const createCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name cannot exceed 100 characters"),

  phone: z
    .string()
    .trim()
    .min(7, "Please provide a valid phone number")
    .max(30, "Phone number cannot exceed 30 characters"),
});

const updateCustomerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Customer name must be at least 2 characters")
      .max(100, "Customer name cannot exceed 100 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .min(7, "Please provide a valid phone number")
      .max(30, "Phone number cannot exceed 30 characters")
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.phone !== undefined,
    {
      message: "At least one field is required",
    }
  );

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
};