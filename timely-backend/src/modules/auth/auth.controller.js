const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("./auth.validation");

const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("./auth.service");

// ==========================================
// Cookie Options
// ==========================================

const getRefreshCookieOptions = (includeMaxAge = true) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/api/v1/auth",
  ...(includeMaxAge ? { maxAge: 7 * 24 * 60 * 60 * 1000 } : {}),
});

// ==========================================
// Register
// ==========================================

const register = async (req, res) => {
  try {
    const validatedData =
      registerSchema.parse(req.body);

    const user =
      await registerUser(validatedData);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Login
// ==========================================

const login = async (req, res) => {
  try {
    const { email, password } =
      loginSchema.parse(req.body);

    const {
      accessToken,
      refreshToken,
      user,
    } = await loginUser(
      email,
      password
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      getRefreshCookieOptions()
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Refresh Token
// ==========================================

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const result =
      await refreshAccessToken(
        refreshToken
      );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      getRefreshCookieOptions()
    );

    return res.status(200).json({
      success: true,
      data: {
        accessToken:
          result.accessToken,
      },
    });
  } catch (error) {
    res.clearCookie(
      "refreshToken",
      getRefreshCookieOptions(false)
    );

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Logout
// ==========================================

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    await logoutUser(refreshToken);

    res.clearCookie(
      "refreshToken",
      getRefreshCookieOptions(false)
    );

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// ==========================================
// Forgot Password
// ==========================================

const forgotPasswordController = async (
  req,
  res
) => {
  try {
    const { email } =
      forgotPasswordSchema.parse(req.body);

    const result =
      await forgotPassword(email);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists for this email, a password reset link has been sent.",
      ...(process.env.NODE_ENV ===
        "development" &&
      result
        ? {
            resetToken:
              result.resetToken,
          }
        : {}),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Reset Password
// ==========================================

const resetPasswordController = async (
  req,
  res
) => {
  try {
    const {
      token,
      password,
    } = resetPasswordSchema.parse(req.body);

    await resetPassword(
      token,
      password
    );

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPasswordController,
  resetPasswordController,
};
