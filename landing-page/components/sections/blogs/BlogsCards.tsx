"use client";

import { useTranslation } from "react-i18next";
import BlogCard from "./BlogCard";
import type { BlogPost } from "@/lib/blogs-api";
import {
  formatBlogDate,
  getBlogCoverImage,
} from "@/lib/blog-utils";

type BlogsCardsProps = {
  posts: BlogPost[];
  loading?: boolean;
};

const BlogsCards = ({ posts, loading = false }: BlogsCardsProps) => {
  const { t, i18n } = useTranslation("translation", { keyPrefix: "blogs" });

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 pt-18 sm:grid-cols-2 xl:grid-cols-3 xl:justify-between">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex w-full min-w-0 animate-pulse flex-col gap-2 rounded-[20px] border border-card-border bg-card-bg p-2 pb-3 sm:rounded-[24px] sm:p-2.5 sm:pb-4"
          >
            <div className="aspect-[4/3] w-full rounded-xl bg-white/10 sm:aspect-auto sm:h-[220px] md:h-[250px] lg:h-[276px]" />
            <div className="flex flex-col gap-3 px-2 py-3">
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="h-6 w-full rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-5 pt-18 sm:grid-cols-2 xl:grid-cols-3 xl:justify-between">
      {posts.map((post) => (
        <BlogCard
          key={post._id}
          image={getBlogCoverImage(post)}
          category={t("page.defaultCategory")}
          date={formatBlogDate(post.createdAt, i18n.language)}
          title={post.title}
          buttonLabel={t("page.readMore")}
          href={`/blogs/${post.slug || post._id}`}
        />
      ))}
    </div>
  );
};

export default BlogsCards;
