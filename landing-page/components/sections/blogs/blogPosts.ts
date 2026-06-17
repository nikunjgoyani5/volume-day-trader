import type { StaticImageData } from "next/image";
import blog1 from "@/assets/images/blog/blog-1.png";
import blog2 from "@/assets/images/blog/blog-2.png";
import blog3 from "@/assets/images/blog/blog-3.png";
import blog4 from "@/assets/images/blog/blog-4.png";
import blog5 from "@/assets/images/blog/blog-5.png";
import blog6 from "@/assets/images/blog/blog-6.png";

export type BlogPostKey =
  | "post1"
  | "post2"
  | "post3"
  | "post4"
  | "post5"
  | "post6"
  | "post7"
  | "post8"
  | "post9";

export type BlogPost = {
  key: BlogPostKey;
  slug: BlogPostKey;
  image: StaticImageData;
};

export const BLOG_POSTS: BlogPost[] = [
  { key: "post1", slug: "post1", image: blog1 },
  { key: "post2", slug: "post2", image: blog2 },
  { key: "post3", slug: "post3", image: blog3 },
  { key: "post4", slug: "post4", image: blog4 },
  { key: "post5", slug: "post5", image: blog5 },
  { key: "post6", slug: "post6", image: blog6 },
  { key: "post7", slug: "post7", image: blog1 },
  { key: "post8", slug: "post8", image: blog2 },
  { key: "post9", slug: "post9", image: blog3 },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getSimilarPosts(
  currentKey: BlogPostKey,
  count = 3,
): BlogPost[] {
  const others = BLOG_POSTS.filter((post) => post.key !== currentKey);
  return others.slice(0, count);
}

export function isBlogPostKey(value: string): value is BlogPostKey {
  return BLOG_POSTS.some((post) => post.key === value);
}
