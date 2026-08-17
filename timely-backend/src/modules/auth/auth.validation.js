const { z } = require("zod");

// ==========================================
// Password
// ==========================================

const passwordSchema = z
  .string()
  .min(
    8,
    "Password must be at least 8 characters"
  )
  .max(
    128,
    "Password cannot exceed 128 characters"
  );

// ==========================================
// Register
// ==========================================

const registerSchema = z
  .object({
    businessName: z
      .string()
      .trim()
      .min(
        2,
        "Business name is required"
      )
      .max(100),

    ownerName: z
      .string()
      .trim()
      .min(
        2,
        "Owner name is required"
      )
      .max(100),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email(
        "Please provide a valid email address"
      ),

    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message:
        "Passwords do not match",
      path: [
        "confirmPassword",
      ],
    }
  );

// ==========================================
// Login
// ==========================================

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(
      "Please provide a valid email address"
    ),

  password: z
    .string()
    .min(
      1,
      "Password is required"
    ),
});

// ==========================================
// Forgot Password
// ==========================================

const forgotPasswordSchema =
  z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email(
        "Please provide a valid email address"
      ),
  });

// ==========================================
// Reset Password
// ==========================================

const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(
        1,
        "Reset token is required"
      ),

    password:
      passwordSchema,

    confirmPassword:
      z.string(),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message:
        "Passwords do not match",
      path: [
        "confirmPassword",
      ],
    }
  );

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};