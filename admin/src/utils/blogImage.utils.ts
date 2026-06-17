import type {
  ApiBlog,
  FeaturedImage,
  GenerateImageResponse,
} from "@/types/blog.types";

/** Max cover file size — must match server multer limit (8 MB). */
export const MAX_COVER_FILE_BYTES = 8 * 1024 * 1024;

export function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com");
}

/** Preview URL for list/detail — prefers `featuredImage.url`, then `coverImage`. */
export function getBlogCoverUrl(raw: {
  featuredImage?: FeaturedImage | null;
  coverImage?: string | null;
}): string | null {
  if (raw.featuredImage?.url) {
    return normalizeRemoteImageUrl(raw.featuredImage.url);
  }
  return normalizeRemoteImageUrl(raw.coverImage);
}

export function featuredImageFromApi(raw: ApiBlog): FeaturedImage | null {
  if (raw.featuredImage?.publicId && raw.featuredImage?.url) {
    return {
      publicId: raw.featuredImage.publicId,
      url: raw.featuredImage.url,
    };
  }
  return null;
}

export function featuredImageFromDetail(raw: ApiBlog): FeaturedImage | null {
  return (
    featuredImageFromApi(raw) ??
    (raw.coverImage && isCloudinaryUrl(raw.coverImage)
      ? inferFeaturedImageFromUrl(raw.coverImage)
      : null)
  );
}

/** Best-effort when API returns coverImage only (legacy rows). */
function inferFeaturedImageFromUrl(url: string): FeaturedImage | null {
  if (!isCloudinaryUrl(url)) return null;
  try {
    const pathname = new URL(url).pathname;
    const uploadIdx = pathname.indexOf("/upload/");
    if (uploadIdx === -1) return null;
    const afterUpload = pathname.slice(uploadIdx + "/upload/".length);
    const parts = afterUpload.split("/");
    const versionIdx = parts.findIndex((p) => /^v\d+$/.test(p));
    const publicIdParts =
      versionIdx >= 0 ? parts.slice(versionIdx + 1) : parts.slice(1);
    const publicId = publicIdParts.join("/").replace(/\.[^/.]+$/, "");
    if (!publicId) return null;
    return { publicId, url };
  } catch {
    return null;
  }
}

/** Parse `POST /generate-image` — permanent Cloudinary URLs only. */
export function parseGenerateImageResponse(
  data: GenerateImageResponse,
): { previewUrl: string; featuredImage: FeaturedImage } {
  const featuredImage = data.featuredImage;
  const previewUrl =
    data.imageUrl?.trim() ||
    data.url?.trim() ||
    featuredImage?.url?.trim();

  if (!featuredImage?.publicId || !featuredImage?.url) {
    throw new Error("Invalid generate-image response: missing featuredImage.");
  }
  if (!previewUrl) {
    throw new Error("Invalid generate-image response: missing preview URL.");
  }

  return { previewUrl, featuredImage };
}

export function featuredImageUnchanged(
  current: FeaturedImage | null | undefined,
  saved: FeaturedImage | null | undefined,
): boolean {
  if (!current && !saved) return true;
  if (!current || !saved) return false;
  return current.publicId === saved.publicId && current.url === saved.url;
}

/**
 * Normalize image URLs for display.
 * API returns absolute Cloudinary HTTPS URLs; blob: is used for local file preview only.
 * Relative paths (e.g. legacy `/uploads/...`) are no longer valid.
 */
export function normalizeRemoteImageUrl(
  url?: string | null,
): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();

  if (trimmed.startsWith("blob:")) {
    return trimmed;
  }

  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }

  return null;
}

/** @deprecated Use normalizeRemoteImageUrl — kept for imports during migration */
export function resolveCoverUrl(coverImage?: string | null): string | null {
  return normalizeRemoteImageUrl(coverImage);
}

export function validateCoverFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please choose an image file (JPEG, PNG, WebP, etc.).";
  }
  if (file.size > MAX_COVER_FILE_BYTES) {
    return "Image must be 8 MB or smaller.";
  }
  return null;
}
