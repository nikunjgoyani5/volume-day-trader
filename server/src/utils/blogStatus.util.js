const BLOG_STATUSES = ["draft", "published", "archived"];

const ALLOWED_TRANSITIONS = {
  draft: ["published"],
  published: ["archived", "draft"],
  archived: ["published"],
};

const CONTENT_FIELDS = [
  "title",
  "content",
  "slug",
  "coverImage",
  "featuredImage",
];

function normalizeStatus(status) {
  if (!status) {
    return "published";
  }
  return status;
}

function isValidStatus(status) {
  return BLOG_STATUSES.includes(status);
}

function assertValidTransition(currentStatus, nextStatus) {
  const current = normalizeStatus(currentStatus);

  if (current === nextStatus) {
    return;
  }

  const allowed = ALLOWED_TRANSITIONS[current] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new Error("Invalid status transition.");
  }
}

function hasContentUpdates(input) {
  return CONTENT_FIELDS.some((field) => input[field] !== undefined);
}

module.exports = {
  BLOG_STATUSES,
  CONTENT_FIELDS,
  normalizeStatus,
  isValidStatus,
  assertValidTransition,
  hasContentUpdates,
};
