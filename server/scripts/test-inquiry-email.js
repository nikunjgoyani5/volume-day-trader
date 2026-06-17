/**
 * Send a test inquiry email pair. Run: node scripts/test-inquiry-email.js
 */
require("dotenv").config();
const emailService = require("../src/services/email.service");

const testInquiry = {
  ticketNumber: "VDT-TEST-0001",
  firstName: "Test",
  lastName: "User",
  email: process.env.TEST_USER_EMAIL || "jayeshbhaijohn@yopmail.com",
  phone: "+4712345678",
  message: "Test inquiry email from script.",
};

async function main() {
  console.log("Sending test emails...");
  console.log("  Admin (INQUIRY_NOTIFY_EMAIL):", process.env.INQUIRY_NOTIFY_EMAIL);
  console.log("  User confirmation:", testInquiry.email);
  await emailService.sendInquiryEmails(testInquiry);
  console.log("Done. Check inbox + Brevo → Transactional → Logs.");
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
