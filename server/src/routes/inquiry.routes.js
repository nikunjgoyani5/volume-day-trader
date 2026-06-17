const express = require("express");
const inquiryController = require("../controllers/inquiry.controller");
const requireAuth = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/auth.middleware").requireAdmin;
const asyncHandler = require("../utils/asyncHandler");
const { validateBody } = require("../middleware/validate.middleware");
const { updateInquiryStatusSchema } = require("../validation/inquiry.validation");

const router = express.Router();

router.post("/", asyncHandler(inquiryController.submitInquiry));

router.get("/", requireAuth, requireAdmin, asyncHandler(inquiryController.listInquiries));

router.patch(
  "/:identifier/status",
  requireAuth,
  requireAdmin,
  validateBody(updateInquiryStatusSchema),
  asyncHandler(inquiryController.updateInquiryStatus),
);

module.exports = router;
