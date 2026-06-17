import type { BlogDetail } from "@/services/blog.service";
import type { FeaturedImage } from "@/types/blog.types";

/** Local UI state only — server data lives in RTK Query cache. */
export type BlogUiState = {
  currentBlog: BlogDetail | null;
  generatedContent: string | null;
  /** Pending Cloudinary asset from generate-image (before save). */
  generatedFeaturedImage: FeaturedImage | null;
  stale: boolean;
};

export type GenerateBlogRequest = {
  prompt: string;
  targetWordCount?: number;
};

export type GenerateImageMutationArg = {
  prompt: string;
  previousPublicId?: string;
};
