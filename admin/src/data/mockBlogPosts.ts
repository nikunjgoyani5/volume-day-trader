import { DEFAULT_COVER_IMAGE } from "@/data/mockBlogPreview";
import type { BlogPost } from "@/types/blog.types";

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Top 5 Wyckoff Trading Strategies for 2026",
    slug: "top-5-wyckoff-trading-strategies-for-2026",
    status: "published",
    coverUrl: DEFAULT_COVER_IMAGE,
    createdAt: "2026-05-28T14:20:00",
    updatedAt: "2026-06-01T09:45:00",
  },
  {
    id: "blog-2",
    title: "How Institutional Traders Use Volume Analysis",
    slug: "how-institutional-traders-use-volume-analysis",
    status: "draft",
    coverUrl: DEFAULT_COVER_IMAGE,
    createdAt: "2026-05-22T11:00:00",
    updatedAt: "2026-05-30T16:10:00",
  },
];
