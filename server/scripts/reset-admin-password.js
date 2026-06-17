/**
 * Reset admin password from terminal (when you cannot login).
 * Uses ADMIN_EMAIL + ADMIN_PASSWORD from .env
 *
 *   npm run reset:admin-password
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const connectDB = require("../src/config/db");
const Admin = require("../src/models/admin.model");

async function reset() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
    process.exit(1);
  }

  await connectDB();

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash"
  );

  if (!admin) {
    console.error("No admin found for:", email);
    console.error("Run: npm run seed:admin");
    process.exit(1);
  }

  admin.passwordHash = await Admin.hashPassword(password);
  await admin.save();

  console.log("Password updated for:", admin.email);
  process.exit(0);
}

reset().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
