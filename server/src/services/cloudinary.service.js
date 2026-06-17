const { v2: cloudinary } = require("cloudinary");
const { env } = require("../config/env");

const BLOG_IMAGE_FOLDER = "blogs";

function isConfigured() {
  return Boolean(
    env.cloudinaryCloudName &&
      env.cloudinaryApiKey &&
      env.cloudinaryApiSecret,
  );
}

function configure() {
  if (!isConfigured()) {
    return false;
  }

  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });

  return true;
}

function assertConfigured() {
  if (!configure()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }
}

function isCloudinaryUrl(url) {
  return (
    typeof url === "string" &&
    /res\.cloudinary\.com/i.test(url)
  );
}

function upload(source, options = {}) {
  assertConfigured();
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      source,
      {
        folder: BLOG_IMAGE_FOLDER,
        resource_type: "image",
        overwrite: false,
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
        });
      },
    );
  });
}

async function uploadBlogImage(source) {
  return upload(source);
}

function uploadBuffer(buffer) {
  assertConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: BLOG_IMAGE_FOLDER,
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
        });
      },
    );

    uploadStream.end(buffer);
  });
}

function destroy(publicId) {
  if (!publicId?.trim()) {
    return Promise.resolve();
  }

  assertConfigured();

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      },
    );
  });
}

async function destroyBlogImage(publicId) {
  try {
    await destroy(publicId);
  } catch (error) {
    console.warn(
      `[cloudinary] Failed to delete image "${publicId}":`,
      error instanceof Error ? error.message : error,
    );
  }
}

module.exports = {
  isConfigured,
  isCloudinaryUrl,
  uploadBlogImage,
  uploadBuffer,
  destroyBlogImage,
};
