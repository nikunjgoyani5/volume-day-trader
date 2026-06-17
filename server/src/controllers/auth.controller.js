const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const { validateNewPassword } = require("../utils/passwordRules");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const result = await authService.login(email.trim().toLowerCase(), password);

  res.json({
    message: "Login successful",
    token: result.token,
    admin: result.admin,
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    admin: req.admin,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "currentPassword and newPassword are required" });
  }

  const passwordError = validateNewPassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  const result = await authService.changePassword(
    req.admin.id,
    currentPassword,
    newPassword
  );

  res.json(result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const result = await authService.forgotPassword(email.trim().toLowerCase());
  res.json(result);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({
      error: "email, token, and newPassword are required",
    });
  }

  const passwordError = validateNewPassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  const result = await authService.resetPasswordWithToken(
    email.trim().toLowerCase(),
    token,
    newPassword
  );

  res.json(result);
});

/** Emergency only — ADMIN_RESET_SECRET in .env */
const resetPasswordEmergency = asyncHandler(async (req, res) => {
  const { email, resetSecret, newPassword } = req.body;

  if (!email || !resetSecret || !newPassword) {
    return res.status(400).json({
      error: "email, resetSecret, and newPassword are required",
    });
  }

  const passwordError = validateNewPassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  const result = await authService.resetPasswordWithSecret(
    email.trim().toLowerCase(),
    resetSecret,
    newPassword
  );

  res.json(result);
});

module.exports = {
  login,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
  resetPasswordEmergency,
};
