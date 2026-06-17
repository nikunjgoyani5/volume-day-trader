require("dotenv").config();

const mongoose = require("mongoose");
const { env } = require("../src/config/env");

async function migrateBlogStatus() {
  await mongoose.connect(env.mongoUri);

  const result = await mongoose.connection.db.collection("blogs").updateMany(
    { status: { $exists: false } },
    { $set: { status: "published" } },
  );

  console.log(
    `Migration complete. Updated ${result.modifiedCount} blog(s) to status "published".`,
  );

  await mongoose.disconnect();
}

migrateBlogStatus().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
