const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { env } = require("../../config/env");
const User = require("../users/user.model");
const {
  PasswordResetToken,
  RefreshToken,
} = require("./auth.model");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const generateAccessToken = (user) => {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
};

const generateRefreshToken = async (userId) => {
  const refreshToken = crypto.randomBytes(64).toString("hex");

  await RefreshToken.create({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return refreshToken;
};

const toPublicUser = (user) => ({
  id: user._id,
  businessName: user.businessName,
  ownerName: user.ownerName,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
});

const registerUser = async (userData) => {
  const { businessName, ownerName, email, password } = userData;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    businessName,
    ownerName,
    email,
    password: passwordHash,
  });

  return toPublicUser(user);
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  user.lastLogin = new Date();
  await user.save();

  return {
    accessToken: generateAccessToken(user),
    refreshToken: await generateRefreshToken(user._id),
    user: toPublicUser(user),
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const storedToken = await RefreshToken.findOne({
    tokenHash: hashToken(refreshToken),
    revoked: false,
    expiresAt: { $gt: new Date() },
  });

  if (!storedToken) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findById(storedToken.userId);

  if (!user) {
    throw new Error("User not found");
  }

  storedToken.revoked = true;
  await storedToken.save();

  return {
    accessToken: generateAccessToken(user),
    refreshToken: await generateRefreshToken(user._id),
  };
};

const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;

  await RefreshToken.findOneAndUpdate(
    { tokenHash: hashToken(refreshToken) },
    { revoked: true }
  );
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) return;

  await PasswordResetToken.deleteMany({ userId: user._id });

  const resetToken = crypto.randomBytes(32).toString("hex");

  await PasswordResetToken.create({
    userId: user._id,
    tokenHash: hashToken(resetToken),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  return { resetToken };
};

const resetPassword = async (token, password) => {
  const resetRecord = await PasswordResetToken.findOne({
    tokenHash: hashToken(token),
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!resetRecord) {
    throw new Error("Invalid or expired password reset token");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.findByIdAndUpdate(resetRecord.userId, { password: passwordHash });

  resetRecord.used = true;
  await resetRecord.save();

  await RefreshToken.updateMany(
    { userId: resetRecord.userId, revoked: false },
    { revoked: true }
  );
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
};
