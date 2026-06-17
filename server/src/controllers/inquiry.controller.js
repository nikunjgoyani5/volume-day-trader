const inquiryService = require("../services/inquiry.service");
const asyncHandler = require("../utils/asyncHandler");

const submitInquiry = asyncHandler(async (req, res) => {
  const inquiry = await inquiryService.createInquiry(req.body);

  res.status(201).json({
    message:
      "Your email was successfully received and a ticket has been generated.",
    ticketNumber: inquiry.ticketNumber,
    inquiry: {
      id: inquiry.id,
      ticketNumber: inquiry.ticketNumber,
      firstName: inquiry.firstName,
      lastName: inquiry.lastName,
      email: inquiry.email,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
    },
  });
});

const listInquiries = asyncHandler(async (req, res) => {
  const inquiries = await inquiryService.listInquiries();

  res.json({
    count: inquiries.length,
    inquiries,
  });
});

const updateInquiryStatus = asyncHandler(async (req, res) => {
  const updated = await inquiryService.updateStatus(
    String(req.params.identifier),
    req.body.status,
  );

  if (!updated) {
    return res.status(404).json({ error: "Inquiry not found" });
  }

  return res.json(updated);
});

module.exports = {
  submitInquiry,
  listInquiries,
  updateInquiryStatus,
};
