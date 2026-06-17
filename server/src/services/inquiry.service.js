const mongoose = require("mongoose");
const Inquiry = require("../models/inquiry.model");
const emailService = require("./email.service");
const { generateTicketNumber } = require("../utils/ticketNumber");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INQUIRY_STATUSES = new Set(["open", "responded", "resolved"]);

function normalizeStatus(value) {
  if (INQUIRY_STATUSES.has(value)) {
    return value;
  }
  return "open";
}

function serializeInquiry(doc) {
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    ...obj,
    id: String(obj._id),
    status: normalizeStatus(obj.status),
  };
}

function buildIdentifierQuery(identifier) {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return { _id: identifier };
  }
  return { ticketNumber: identifier };
}

function validateInquiryPayload(body) {
  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();
  const email = body.email?.trim().toLowerCase();
  const phone = body.phone?.trim() || "";
  const message = body.message?.trim();

  if (!firstName || !lastName || !email || !message) {
    const err = new Error(
      "firstName, lastName, email, and message are required",
    );
    err.statusCode = 400;
    throw err;
  }

  if (!EMAIL_RE.test(email)) {
    const err = new Error("A valid email address is required");
    err.statusCode = 400;
    throw err;
  }

  if (message.length < 10) {
    const err = new Error("Message must be at least 10 characters");
    err.statusCode = 400;
    throw err;
  }

  return { firstName, lastName, email, phone, message };
}

function buildStatusUpdates(nextStatus) {
  const now = new Date();
  const updates = { status: nextStatus };

  if (nextStatus === "responded") {
    updates.respondedAt = now;
  }

  if (nextStatus === "resolved") {
    updates.resolvedAt = now;
  }

  if (nextStatus === "open") {
    updates.respondedAt = null;
    updates.resolvedAt = null;
  }

  return updates;
}

async function createInquiry(body) {
  const data = validateInquiryPayload(body);
  const ticketNumber = generateTicketNumber();

  const inquiry = await Inquiry.create({
    ...data,
    ticketNumber,
    status: "open",
  });

  try {
    await emailService.sendInquiryEmails(inquiry);
  } catch (error) {
    console.error(
      "[inquiry] Saved to database but email delivery failed:",
      error instanceof Error ? error.message : error,
    );
  }

  return serializeInquiry(inquiry);
}

async function listInquiries() {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  return inquiries.map(serializeInquiry);
}

async function updateStatus(identifier, nextStatus) {
  const status = normalizeStatus(nextStatus);
  const query = buildIdentifierQuery(String(identifier));
  const existing = await Inquiry.findOne(query);

  if (!existing) {
    return null;
  }

  const updated = await Inquiry.findOneAndUpdate(
    query,
    buildStatusUpdates(status),
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return updated ? serializeInquiry(updated) : null;
}

module.exports = {
  createInquiry,
  listInquiries,
  updateStatus,
};
