const express = require("express");
const authController = require("../controllers/auth.controller");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", authController.login);

// Forgot password flow (email link)
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Logged in
router.patch("/change-password", requireAuth, authController.changePassword);
router.get("/me", requireAuth, authController.getMe);

// Emergency (ADMIN_RESET_SECRET) — not for admin UI
router.post("/reset-password-emergency", authController.resetPasswordEmergency);

module.exports = router;
