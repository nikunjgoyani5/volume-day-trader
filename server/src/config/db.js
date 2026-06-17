const mongoose = require("mongoose");
const { env } = require("./env");

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  isConnected = true;
  console.log("MongoDB connected:", mongoose.connection.name);
  return mongoose;
}

function isMongoConnectionError(error) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("mongodb") ||
    message.includes("querysrv") ||
    message.includes("enotfound") ||
    message.includes("mongoose") ||
    message.includes("timed out") ||
    message.includes("econnrefused")
  );
}

module.exports = connectDB;
module.exports.isMongoConnectionError = isMongoConnectionError;
