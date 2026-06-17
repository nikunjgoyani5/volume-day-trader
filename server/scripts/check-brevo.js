/**
 * Quick Brevo config check (does not print your API key).
 * Run: node scripts/check-brevo.js
 */
require("dotenv").config();

const BREVO_SENDERS_URL = "https://api.brevo.com/v3/senders";

const raw = process.env.BREVO_SMTP_KEY?.trim() || "";
const sender = process.env.BREVO_SENDER_EMAIL?.trim() || "";

function maskKey(key) {
  if (!key) return "(empty)";
  if (key.length < 12) return "(too short)";
  return `${key.slice(0, 10)}...${key.slice(-4)} (${key.length} chars)`;
}

const isPlaceholder =
  !raw ||
  /your-api-key|xkeysib-your|xsmtpsib-your/i.test(raw) ||
  (raw.startsWith("xkeysib-") && raw.length < 50) ||
  (raw.startsWith("xsmtpsib-") && raw.length < 50);

console.log("\n--- Brevo config check ---\n");
console.log("BREVO_SMTP_KEY:", maskKey(raw));
console.log("Placeholder template still in use:", isPlaceholder ? "YES — replace in .env" : "no");
console.log("BREVO_SENDER_EMAIL:", sender || "(not set — will fetch from Brevo API)");
console.log("INQUIRY_NOTIFY_EMAIL:", process.env.INQUIRY_NOTIFY_EMAIL || "(default)");

if (!raw || isPlaceholder) {
  console.log("\nResult: NOT READY — paste your real xkeysib key into server/.env and save the file.\n");
  process.exit(1);
}

async function main() {
  if (sender && raw.startsWith("xkeysib-")) {
    const res = await fetch(BREVO_SENDERS_URL, {
      headers: { "api-key": raw, accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      const verified = data.senders?.filter((s) => s.active !== false) || [];
      const match = verified.find(
        (s) => s.email?.toLowerCase() === sender.toLowerCase()
      );
      if (!match) {
        console.log(
          "\nNote: BREVO_SENDER_EMAIL is not in Brevo verified list (delivery may fail)."
        );
        verified.forEach((s) => console.log("  Verified in Brevo:", s.email));
      } else {
        console.log("\nSender is verified in Brevo.");
      }
    }
  }

  if (sender) {
    console.log("\nResult: READY (using BREVO_SENDER_EMAIL).");
    console.log("Restart server (npm run dev) and submit the contact form again.\n");
    return;
  }

  if (!raw.startsWith("xkeysib-")) {
    console.log("\nResult: Key format looks like SMTP (email|xsmtpsib). Skipping API sender test.");
    console.log("Restart server and test the contact form.\n");
    return;
  }

  const res = await fetch(BREVO_SENDERS_URL, {
    headers: { "api-key": raw, accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text();
    console.log("\nResult: API key rejected by Brevo (" + res.status + ").");
    console.log("Tip: Copy a fresh key from Brevo → SMTP & API → API Keys.");
    if (body) console.log("Brevo says:", body.slice(0, 200));
    console.log("\nOr set BREVO_SENDER_EMAIL=your-verified@email.com in .env\n");
    process.exit(1);
  }

  const data = await res.json();
  const verified = data.senders?.filter((s) => s.active !== false) || [];
  console.log("\nVerified senders in Brevo:", verified.length);
  verified.slice(0, 5).forEach((s) => console.log("  -", s.email));
  if (verified.length === 0) {
    console.log("\nResult: Key works but no verified sender. Add one in Brevo → Senders.");
    process.exit(1);
  }
  console.log(
    "\nTip: Add to .env for faster sends:\n  BREVO_SENDER_EMAIL=" + verified[0].email
  );
  console.log("\nResult: READY. Restart server and test the form.\n");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
