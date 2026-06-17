const connectDB = require("../config/db");
const isMongoConnectionError = connectDB.isMongoConnectionError;
const { blogService } = require("../services/blog.service");
const { openaiService } = require("../services/openai.service");
const cloudinaryService = require("../services/cloudinary.service");
const { coverImageUpload, parseMultipartBody, } = require("../services/upload.service");
const {
  createBlogSchema,
  updateBlogSchema,
} = require("../validation/blog.validation");

const CLIENT_ERROR_MESSAGES = new Set([
  "Archived blogs cannot be edited.",
  "Invalid status transition.",
  "featuredImage.url must be a Cloudinary secure URL.",
]);

function getErrorStatus(message) {
  if (message.includes("JSON")) return 400;
  if (CLIENT_ERROR_MESSAGES.has(message)) return 400;
  return 500;
}

// Parse blog payload from JSON or multipart requests
async function parseBlogBody(req) {
  const contentType = req.headers["content-type"] ?? "";

  if (contentType.includes("multipart/form-data")) {
    const parsed = parseMultipartBody(req.body ?? {});
    const file = req.file;
    if (file) {
      if (!cloudinaryService.isConfigured()) {
        throw new Error(
          "Cloudinary is not configured. Image uploads require CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        );
      }

      const uploaded = await cloudinaryService.uploadBuffer(file.buffer);
      parsed.featuredImage = uploaded;
      parsed.coverImage = uploaded.url;
    }
    return parsed;
  }

  return req.body ?? {};
}


function handleBlogError(res, error, fallbackMessage) {
  const message =
    error instanceof Error ? error.message : fallbackMessage;
  console.error(fallbackMessage, error);
  return res.status(getErrorStatus(message)).json({ error: message });
}

// Public blog list — published only
async function listPublic(req, res) {
  const query = req.query;

  try {
    await connectDB();
    const result = await blogService.list(query, { publishedOnly: true });
    return res.json(result);
  } catch (error) {
    if (isMongoConnectionError(error)) {
      const hint =
        process.env.NODE_ENV === "development"
          ? " Check MONGODB_URI in .env (Atlas SRV host should look like cluster0.xxxxx.mongodb.net)."
          : "";
      console.warn(
        `[api/blogs] MongoDB unavailable.${hint} Returning empty blog list.`,
      );
      return res.json({
        blogs: [],
        total: 0,
        page: query.page,
        limit: query.limit,
        hasMore: false,
      });
    }
    return handleBlogError(res, error, "Error listing public blogs:");
  }
}

// Admin blog list with optional status filter
async function list(req, res) {
  const query = req.query;

  try {
    await connectDB();
    const result = await blogService.list(query);
    return res.json(result);
  } catch (error) {
    if (isMongoConnectionError(error)) {
      const hint =
        process.env.NODE_ENV === "development"
          ? " Check MONGODB_URI in .env (Atlas SRV host should look like cluster0.xxxxx.mongodb.net)."
          : "";
      console.warn(
        `[api/blogs] MongoDB unavailable.${hint} Returning empty blog list.`,
      );
      return res.json({
        blogs: [],
        total: 0,
        page: query.page,
        limit: query.limit,
        hasMore: false,
      });
    }
    console.error("Error listing blogs:", error);
    return res.status(500).json({ error: "Failed to fetch blogs" });
  }
}


// Public single blog — published only
async function getOnePublic(req, res) {
  try {
    await connectDB();
    const blog = await blogService.getByIdentifier(
      String(req.params.identifier),
      { publishedOnly: true },
    );
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    return res.json(blog);
  } catch (error) {
    return handleBlogError(res, error, "Error fetching public blog:");
  }
}

// Admin single blog by ID or slug
async function getOne(req, res) {
  try {
    await connectDB();
    const blog = await blogService.getByIdentifier(
      String(req.params.identifier),
    );
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    return res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).json({ error: "Failed to fetch blog" });
  }
}


// Create a new blog and upload cover image to Cloudinary if provided
async function create(req, res) {
  try {
    const body = await parseBlogBody(req);
    const parsed = createBlogSchema.safeParse(body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    await connectDB();
    const blog = await blogService.create(parsed.data);
    return res.status(201).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return handleBlogError(res, error, "Error creating blog:");
  }
}


// Update an existing blog and optionally replace its cover image
async function update(req, res) {
  try {
    const body = await parseBlogBody(req);
    const parsed = updateBlogSchema.safeParse(body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    await connectDB();
    const updated = await blogService.update(
      String(req.params.identifier),
      parsed.data,
    );

    if (!updated) {
      return res.status(404).json({ error: "Blog not found" });
    }

    return res.json(updated);
  } catch (error) {
    return handleBlogError(res, error, "Error updating blog:");
  }
}

// Update blog status (publish, archive, restore)
async function updateStatus(req, res) {
  try {
    await connectDB();
    const updated = await blogService.updateStatus(
      String(req.params.identifier),
      req.body.status,
    );

    if (!updated) {
      return res.status(404).json({ error: "Blog not found" });
    }

    return res.json(updated);
  } catch (error) {
    return handleBlogError(res, error, "Error updating blog status:");
  }
}

// Blog status counts for admin dashboard
async function stats(req, res) {
  try {
    await connectDB();
    const result = await blogService.getStats();
    return res.json(result);
  } catch (error) {
    return handleBlogError(res, error, "Error fetching blog stats:");
  }
}

// Delete a blog and its associated Cloudinary assets
async function remove(req, res) {
  try {
    await connectDB();
    const identifier = String(req.params.identifier);
    const deleted = await blogService.remove(identifier);

    if (!deleted) {
      return res.status(404).json({ error: "Blog not found" });
    }

    return res.json({ message: "Blog deleted successfully", blog: deleted });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ error: "Failed to delete blog" });
  }
}


// Generate AI-powered blog content from a prompt
async function generateContent(req, res) {
  try {
    const { prompt, targetWordCount } = req.body;
    const content = await openaiService.generateBlogHtml(
      prompt,
      targetWordCount,
    );
    return res.json({ content });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error occurred.";
    const status = message.includes("OPENAI") ? 500 : 502;
    return res.status(status).json({ error: message });
  }
}


// Generate an AI cover image and store it in Cloudinary
async function generateImage(req, res) {
  try {
    const { prompt, previousPublicId } = req.body;

    if (!cloudinaryService.isConfigured()) {
      return res.status(500).json({
        error:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      });
    }

    if (previousPublicId) {
      await cloudinaryService.destroyBlogImage(previousPublicId);
    }

    const tempSource = await openaiService.generateCoverImageUrl(prompt);
    const featuredImage = await cloudinaryService.uploadBlogImage(tempSource);

    return res.json({
      url: featuredImage.url,
      imageUrl: featuredImage.url,
      featuredImage,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected error while generating image.";
    return res.status(500).json({ error: message });
  }
}


// Multer middleware for handling cover image uploads
const uploadCoverMiddleware = coverImageUpload.single("coverImage");

module.exports = {
  listPublic,
  list,
  getOnePublic,
  getOne,
  create,
  update,
  updateStatus,
  stats,
  remove,
  generateContent,
  generateImage,
  uploadCoverMiddleware,
};
