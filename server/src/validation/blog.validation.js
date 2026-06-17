const { z } = require("zod");

const blogStatusSchema = z.enum(["draft", "published", "archived"]);

const featuredImageSchema = z.object({
  publicId: z.string().min(1),
  url: z.string().url(),
});

const createBlogSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  slug: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  featuredImage: featuredImageSchema.optional(),
  status: z.enum(["draft", "published"]).optional().default("draft"),
});

const updateBlogSchema = z
  .object({
    title: z.string().min(1).max(300).optional(),
    slug: z.string().min(1).max(200).optional(),
    content: z.string().optional(),
    coverImage: z.string().optional(),
    featuredImage: featuredImageSchema.optional(),
    status: blogStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

const updateBlogStatusSchema = z.object({
  status: z.enum(["draft", "published", "archived"]),
});

const listBlogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: blogStatusSchema.optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("updatedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const generateBlogSchema = z.object({
  prompt: z.string().min(1, "Prompt is required."),
  targetWordCount: z.coerce.number().int().min(100).max(10000).optional(),
});

const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required."),
  previousPublicId: z.string().min(1).optional(),
});

module.exports = {
  blogStatusSchema,
  featuredImageSchema,
  createBlogSchema,
  updateBlogSchema,
  updateBlogStatusSchema,
  listBlogsQuerySchema,
  generateBlogSchema,
  generateImageSchema,
};
