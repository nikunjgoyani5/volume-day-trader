import { inquiryApi, type ApiInquiry } from "@/api/inquiry.api";
import type { ContactSubmission, InquiryStatus } from "@/types/contact.types";
import { getPersistedAuth } from "@/utils/authStorage";
import { normalizeInquiryStatus } from "@/utils/inquiryStatus.utils";

function mapInquiry(raw: ApiInquiry): ContactSubmission {
  return {
    id: String(raw._id ?? raw.id ?? ""),
    ticketNumber: raw.ticketNumber,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phone: raw.phone ?? "",
    message: raw.message,
    status: normalizeInquiryStatus(raw.status),
    respondedAt: raw.respondedAt ?? null,
    resolvedAt: raw.resolvedAt ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function getAccessToken() {
  const session = getPersistedAuth();
  if (!session?.accessToken) {
    throw new Error("Not authenticated");
  }
  return session.accessToken;
}

export const inquiryService = {
  async listInquiries(): Promise<ContactSubmission[]> {
    const data = await inquiryApi.listInquiries(getAccessToken());
    return data.inquiries.map(mapInquiry);
  },

  async updateInquiryStatus(
    id: string,
    status: InquiryStatus,
  ): Promise<ContactSubmission> {
    const updated = await inquiryApi.updateInquiryStatus(
      getAccessToken(),
      id,
      status,
    );
    return mapInquiry(updated);
  },
};
