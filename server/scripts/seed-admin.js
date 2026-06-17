/**
 * Run once to create the first admin user (password is hashed before save).
 *
 *   npm run seed:admin
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const connectDB = require("../src/config/db");
const Admin = require("../src/models/admin.model");

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ email: email.toLowerCase() });

  if (existing) {
    console.log("Admin already exists:", existing.email);
    process.exit(0);
  }

  const passwordHash = await Admin.hashPassword(password);

  await Admin.create({
    email: email.toLowerCase(),
    passwordHash,
  });

  console.log("Admin created:", email);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
