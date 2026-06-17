const multer = require("multer");

const coverImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

function parseMultipartBody(body) {
  const parsed = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value !== "string") {
      parsed[key] = value;
      continue;
    }
    if (
      (value.startsWith("{") && value.endsWith("}")) ||
      (value.startsWith("[") && value.endsWith("]"))
    ) {
      try {
        parsed[key] = JSON.parse(value);
        continue;
      } catch {
        // keep string
      }
    }
    if (value === "true" || value === "false") {
      parsed[key] = value === "true";
      continue;
    }
    parsed[key] = value;
  }
  return parsed;
}

module.exports = {
  coverImageUpload,
  parseMultipartBody,
};
