/** Cloudinary asset stored on the blog (source of truth for covers). */
export type FeaturedImage = {
  publicId: string;
  url: string;
};

export type BlogStatus = "draft" | "published" | "archived";

/** Blog document from `GET/POST/PATCH /api/admin/blogs` (Mongo model). */
export type ApiBlog = {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  content: string;
  status: BlogStatus;
  coverImage?: string | null;
  featuredImage?: FeaturedImage | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  status: BlogStatus;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: BlogStatus;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
};

export type BlogListResponse = {
  blogs: ApiBlog[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export type BlogStatsResponse = {
  total: number;
  draft: number;
  published: number;
  archived: number;
};

export type CreateBlogPayload = {
  title?: string;
  slug?: string;
  content: string;
  status?: Extract<BlogStatus, "draft" | "published">;
  featuredImage?: FeaturedImage;
  /** Fallback when uploading via multipart only */
  coverImage?: string;
};

export type UpdateBlogPayload = {
  title?: string;
  slug?: string;
  content?: string;
  status?: BlogStatus;
  featuredImage?: FeaturedImage;
  coverImage?: string;
};

export type UpdateBlogStatusPayload = {
  status: BlogStatus;
};

export type GenerateImageRequest = {
  prompt: string;
  previousPublicId?: string;
};

export type GenerateImageResponse = {
  url: string;
  imageUrl: string;
  featuredImage: FeaturedImage;
};

export type DeleteBlogResponse = {
  message: string;
  blog: ApiBlog;
};
