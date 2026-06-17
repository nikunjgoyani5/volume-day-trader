const { z } = require("zod");

const inquiryStatusSchema = z.enum(["open", "responded", "resolved"]);

const updateInquiryStatusSchema = z.object({
  status: inquiryStatusSchema,
});

module.exports = {
  inquiryStatusSchema,
  updateInquiryStatusSchema,
};
