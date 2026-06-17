function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const env = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required(
    "MONGODB_URI",
    "mongodb://127.0.0.1:27017/volumedaytrader",
  ),
  jwtSecret: process.env.JWT_SECRET ?? "dev-jwt-secret-change-me",
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  openAiImageModel: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  adminClientUrl: process.env.ADMIN_CLIENT_URL ?? "http://localhost:5173",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  nodeEnv: process.env.NODE_ENV ?? "development",
};

module.exports = { env };
