const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const emailService = require("./email.service");
const { generateResetToken, hashResetToken } = require("../utils/resetToken");

const FORGOT_PASSWORD_MESSAGE =
  "Password reset link has been sent to your email.";
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function signToken(admin) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  return jwt.sign(
    {
      sub: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

async function login(email, password) {
  const admin = await Admin.findOne({ email }).select("+passwordHash");

  if (!admin) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(admin);

  return {
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
  };
}

async function changePassword(adminId, currentPassword, newPassword) {
  const admin = await Admin.findById(adminId).select("+passwordHash");

  if (!admin) {
    const err = new Error("Admin not found");
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await admin.comparePassword(currentPassword);

  if (!isMatch) {
    const err = new Error("Current password is incorrect");
    err.statusCode = 401;
    throw err;
  }

  admin.passwordHash = await Admin.hashPassword(newPassword);
  await admin.save();

  const token = signToken(admin);

  return {
    message: "Password updated successfully",
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
  };
}

/**
 * Emergency reset when admin forgot password (no JWT).
 * Requires ADMIN_RESET_SECRET in .env — never expose this in frontend code.
 */
async function resetPasswordWithSecret(email, resetSecret, newPassword) {
  const expectedSecret = process.env.ADMIN_RESET_SECRET;

  if (!expectedSecret) {
    const err = new Error("Password reset is not configured on server");
    err.statusCode = 503;
    throw err;
  }

  if (resetSecret !== expectedSecret) {
    const err = new Error("Invalid reset secret");
    err.statusCode = 403;
    throw err;
  }

  const admin = await Admin.findOne({ email }).select("+passwordHash");

  if (!admin) {
    const err = new Error("Admin not found");
    err.statusCode = 404;
    throw err;
  }

  admin.passwordHash = await Admin.hashPassword(newPassword);
  await admin.save();

  return { message: "Password reset successfully. Please login with the new password." };
}

/**
 * Forgot password — sends email only if admin exists.
 */
async function forgotPassword(email) {
  const admin = await Admin.findOne({ email });

  if (!admin) {
    const err = new Error("No admin account found with this email");
    err.statusCode = 404;
    throw err;
  }

  const token = generateResetToken();
  admin.resetPasswordTokenHash = hashResetToken(token);
  admin.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await admin.save();

  await emailService.sendPasswordResetEmail(admin.email, token);

  return { message: FORGOT_PASSWORD_MESSAGE };
}

/**
 * Set new password using token from email link.
 */
async function resetPasswordWithToken(email, token, newPassword) {
  const admin = await Admin.findOne({ email }).select(
    "+passwordHash +resetPasswordTokenHash +resetPasswordExpires"
  );

  if (
    !admin ||
    !admin.resetPasswordTokenHash ||
    !admin.resetPasswordExpires
  ) {
    const err = new Error("Invalid or expired reset link");
    err.statusCode = 400;
    throw err;
  }

  if (admin.resetPasswordExpires.getTime() < Date.now()) {
    admin.clearPasswordReset();
    await admin.save();
    const err = new Error("Reset link has expired. Request a new one.");
    err.statusCode = 400;
    throw err;
  }

  const tokenHash = hashResetToken(token);
  if (tokenHash !== admin.resetPasswordTokenHash) {
    const err = new Error("Invalid or expired reset link");
    err.statusCode = 400;
    throw err;
  }

  admin.passwordHash = await Admin.hashPassword(newPassword);
  admin.clearPasswordReset();
  await admin.save();

  return {
    message: "Password reset successfully. You can log in with your new password.",
  };
}

module.exports = {
  login,
  signToken,
  changePassword,
  resetPasswordWithSecret,
  forgotPassword,
  resetPasswordWithToken,
};
