import type { FeaturedImage, UpdateBlogPayload } from "@/types/blog.types";
import { featuredImageUnchanged } from "@/utils/blogImage.utils";

type PrepareUpdateOptions = {
  /** Cloudinary asset from generate-image or loaded post */
  featuredImage?: FeaturedImage | null;
  savedFeaturedImage?: FeaturedImage | null;
  /** When true, cover is sent via multipart — omit featuredImage from JSON */
  pendingCoverFile?: boolean;
};

/** Build PATCH body matching backend `updateBlogSchema`. */
export function prepareBlogUpdatePayload(
  payload: Pick<UpdateBlogPayload, "title" | "slug" | "content"> & {
    featuredImage?: FeaturedImage;
  },
  options?: PrepareUpdateOptions,
): UpdateBlogPayload {
  const next: UpdateBlogPayload = {};

  if (payload.title?.trim()) next.title = payload.title.trim();
  if (payload.slug?.trim()) next.slug = payload.slug.trim();
  if (payload.content !== undefined) next.content = payload.content;

  if (!options?.pendingCoverFile && payload.featuredImage) {
    const saved = options?.savedFeaturedImage;
    if (!featuredImageUnchanged(payload.featuredImage, saved)) {
      next.featuredImage = {
        publicId: payload.featuredImage.publicId,
        url: payload.featuredImage.url,
      };
    }
  }

  return next;
}
