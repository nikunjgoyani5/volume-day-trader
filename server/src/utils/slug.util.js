function slugifyTitle(title) {
  let base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!base) {
    base = `post-${Math.random().toString(36).substring(2, 7)}`;
  }

  return base;
}

async function ensureUniqueSlug(baseSlug, exists) {
  let slug = baseSlug;
  if (await exists(slug)) {
    const suffix = Math.random().toString(36).substring(2, 6);
    slug = `${baseSlug}-${suffix}`;
  }
  return slug;
}

function extractTitleFromHtml(content) {
  const match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (!match?.[1]) return null;
  return match[1].replace(/<[^>]+>/g, "").trim() || null;
}

module.exports = {
  slugifyTitle,
  ensureUniqueSlug,
  extractTitleFromHtml,
};
