require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log("OpenAI Key Loaded:", !!process.env.OPENAI_API_KEY);
      console.log("Cloudinary Configured:", !!process.env.CLOUDINARY_CLOUD_NAME);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
