const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AppError = require("../../utils/AppError");
const { env } = require("../../config/env");

const User = require("../users/user.model");

const {
  PasswordResetToken,
  RefreshToken,
} = require("./auth.model");

// ==========================================
// Hash Token
// ==========================================

const hashToken = (token) =>
  crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

// ==========================================
// Generate Access Token
// ==========================================

const generateAccessToken = (user) => {
  if (!env.jwtSecret) {
    throw new AppError(
      "JWT configuration is missing",
      500
    );
  }

  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
};

// ==========================================
// Generate Refresh Token
// ==========================================

const generateRefreshToken = async (userId) => {
  const refreshToken = crypto
    .randomBytes(64)
    .toString("hex");

  await RefreshToken.create({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
  });

  return refreshToken;
};

// ==========================================
// Public User
// ==========================================

const toPublicUser = (user) => ({
  id: user._id,
  businessName: user.businessName,
  ownerName: user.ownerName,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
});

// ==========================================
// Register
// ==========================================

const registerUser = async (userData) => {
  const {
    businessName,
    ownerName,
    email,
    password,
  } = userData;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new AppError(
      "An account with this email already exists",
      409
    );
  }

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  const user = await User.create({
    businessName,
    ownerName,
    email,
    password: passwordHash,
  });

  return toPublicUser(user);
};

// ==========================================
// Get Current User
// ==========================================

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  return {
    id: user._id,
    businessName: user.businessName,
    ownerName: user.ownerName,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// ==========================================
// Login
// ==========================================

const loginUser = async (email, password) => {
  const user = await User.findOne({
    email,
  }).select("+password");

  if (
    !user ||
    !(await bcrypt.compare(
      password,
      user.password
    ))
  ) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  user.lastLogin = new Date();

  await user.save();

  const accessToken =
    generateAccessToken(user);

  const refreshToken =
    await generateRefreshToken(user._id);

  return {
    accessToken,
    refreshToken,
    user: toPublicUser(user),
  };
};

// ==========================================
// Refresh Access Token
// ==========================================

const refreshAccessToken = async (
  refreshToken
) => {
  if (!refreshToken) {
    throw new AppError(
      "Refresh token is required",
      401
    );
  }

  const storedToken =
    await RefreshToken.findOne({
      tokenHash: hashToken(refreshToken),
      revoked: false,
      expiresAt: {
        $gt: new Date(),
      },
    });

  if (!storedToken) {
    throw new AppError(
      "Invalid or expired refresh token",
      401
    );
  }

  const user = await User.findById(
    storedToken.userId
  );

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  // Revoke old refresh token
  storedToken.revoked = true;

  await storedToken.save();

  // Issue new tokens
  const newAccessToken =
    generateAccessToken(user);

  const newRefreshToken =
    await generateRefreshToken(user._id);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// ==========================================
// Logout
// ==========================================

const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash: hashToken(refreshToken),
    },
    {
      revoked: true,
    }
  );
};

// ==========================================
// Forgot Password
// ==========================================

const forgotPassword = async (email) => {
  const user = await User.findOne({
    email,
  });

  // Don't reveal whether the account exists
  if (!user) {
    return;
  }

  // Remove previous reset tokens
  await PasswordResetToken.deleteMany({
    userId: user._id,
  });

  // Generate secure reset token
  const resetToken = crypto
    .randomBytes(32)
    .toString("hex");

  // Store only the hash
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash: hashToken(resetToken),
    expiresAt: new Date(
      Date.now() + 15 * 60 * 1000
    ),
  });

  return {
    resetToken,
  };
};

// ==========================================
// Reset Password
// ==========================================

const resetPassword = async (
  token,
  password
) => {
  const resetRecord =
    await PasswordResetToken.findOne({
      tokenHash: hashToken(token),
      used: false,
      expiresAt: {
        $gt: new Date(),
      },
    });

  if (!resetRecord) {
    throw new AppError(
      "Invalid or expired password reset token",
      400
    );
  }

  const passwordHash =
    await bcrypt.hash(password, 12);

  await User.findByIdAndUpdate(
    resetRecord.userId,
    {
      password: passwordHash,
    }
  );

  // Mark reset token as used
  resetRecord.used = true;

  await resetRecord.save();

  // Invalidate existing sessions
  await RefreshToken.updateMany(
    {
      userId: resetRecord.userId,
      revoked: false,
    },
    {
      revoked: true,
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
};