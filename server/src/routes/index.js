const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const inquiryRoutes = require("./inquiry.routes");
const blogRoutes = require("./blog.routes");
const blogPublicRoutes = require("./blog.public.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/blogs", blogPublicRoutes);
router.use("/admin/blogs", blogRoutes);

module.exports = router;
