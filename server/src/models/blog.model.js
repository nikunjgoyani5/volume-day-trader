const mongoose = require("mongoose");

const featuredImageSchema = new mongoose.Schema(
  {
    publicId: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { _id: false },
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true, default: "" },
    coverImage: { type: String, trim: true },
    featuredImage: featuredImageSchema,
    slug: { type: String, unique: true, sparse: true, trim: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true },
);

const Blog =
  mongoose.models.Blog ?? mongoose.model("Blog", blogSchema);

module.exports = Blog;
