const express = require("express");
const blogController = require("../controllers/blog.controller");
const asyncHandler = require("../utils/asyncHandler");
const { validateQuery } = require("../middleware/validate.middleware");
const { listBlogsQuerySchema } = require("../validation/blog.validation");

const router = express.Router();

router.get("/", validateQuery(listBlogsQuerySchema), asyncHandler(blogController.listPublic),);

router.get("/:identifier", asyncHandler(blogController.getOnePublic));

module.exports = router;
