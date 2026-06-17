const crypto = require("crypto");

/**
 * Human-readable ticket id, e.g. VDT-20260603-A1B2C3
 */
function generateTicketNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `VDT-${date}-${suffix}`;
}

module.exports = { generateTicketNumber };
