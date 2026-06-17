const express = require("express");
const blogController = require("../controllers/blog.controller");
const requireAuth = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/auth.middleware").requireAdmin;
const asyncHandler = require("../utils/asyncHandler");
const { validateBody, validateQuery } = require("../middleware/validate.middleware");
const {
  generateBlogSchema,
  generateImageSchema,
  listBlogsQuerySchema,
  updateBlogStatusSchema,
} = require("../validation/blog.validation");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.post(
  "/generate",
  validateBody(generateBlogSchema),
  asyncHandler(blogController.generateContent),
);

router.post(
  "/generate-image",
  validateBody(generateImageSchema),
  asyncHandler(blogController.generateImage),
);

router.get("/stats", asyncHandler(blogController.stats));

router.get(
  "/",
  validateQuery(listBlogsQuerySchema),
  asyncHandler(blogController.list),
);

router.post(
  "/",
  blogController.uploadCoverMiddleware,
  asyncHandler(blogController.create),
);

router.patch(
  "/:identifier/status",
  validateBody(updateBlogStatusSchema),
  asyncHandler(blogController.updateStatus),
);

router.get("/:identifier", asyncHandler(blogController.getOne));

router.patch(
  "/:identifier",
  blogController.uploadCoverMiddleware,
  asyncHandler(blogController.update),
);

router.delete("/:identifier", asyncHandler(blogController.remove));

module.exports = router;
