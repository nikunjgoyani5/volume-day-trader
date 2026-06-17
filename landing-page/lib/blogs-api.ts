import { getApiUrl } from "@/lib/api";

export type BlogPost = {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  featuredImage?: {
    publicId?: string;
    url?: string;
  };
  createdAt: string;
  updatedAt?: string;
};

export type BlogsListData = {
  blogs: BlogPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

/** GET /api/blogs?page=&limit= */
export async function fetchPublicBlogs(
  params: { page?: number; limit?: number; search?: string } = {},
  init?: RequestInit,
): Promise<BlogsListData> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const search = params.search?.trim();

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    query.set("search", search);
  }

  const res = await fetch(getApiUrl(`/blogs?${query.toString()}`), init);

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json() as Promise<BlogsListData>;
}

/** GET /api/blogs/:slug */
export async function fetchPublicBlogBySlug(
  slug: string,
  init?: RequestInit,
): Promise<BlogPost> {
  const res = await fetch(
    getApiUrl(`/blogs/${encodeURIComponent(slug)}`),
    init,
  );

  if (!res.ok) {
    throw new Error("Blog not found");
  }

  return res.json() as Promise<BlogPost>;
}
