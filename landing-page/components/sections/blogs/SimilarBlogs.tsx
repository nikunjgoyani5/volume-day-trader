"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CtaFlowLink from "@/components/ui/cta-flow/CtaFlowLink";
import Heading from "@/components/ui/heading/Heading";
import BlogCard from "./BlogCard";
import { fetchPublicBlogs, type BlogPost } from "@/lib/blogs-api";
import {
  formatBlogDate,
  getBlogCoverImage,
} from "@/lib/blog-utils";

type SimilarBlogsProps = {
  currentSlug: string;
};

export default function SimilarBlogs({ currentSlug }: SimilarBlogsProps) {
  const { t, i18n } = useTranslation("translation", { keyPrefix: "blogs" });
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadSimilarBlogs() {
      try {
        const { blogs } = await fetchPublicBlogs({ page: 1, limit: 4 });
        const similar = blogs
          .filter((blog) => (blog.slug || blog._id) !== currentSlug)
          .slice(0, 3);

        if (!cancelled) {
          setPosts(similar);
        }
      } catch {
        if (!cancelled) {
          setPosts([]);
        }
      }
    }

    loadSimilarBlogs();

    return () => {
      cancelled = true;
    };
  }, [currentSlug]);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-8 border-t border-[#1D1E38] pt-10 md:gap-10 md:pt-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <Heading
          as="h2"
          variant="page-content"
          align="left"
          text={t("detail.similarBlogs")}
        />

        <CtaFlowLink
          href="/blogs"
          label={t("detail.allBlogs")}
          arrowClassName="h-3.5 w-3.5 sm:h-4 sm:w-4"
          className="inline-flex items-center gap-2 rounded-full bg-[#151032] px-4 py-2 text-sm font-medium text-white shadow-[inset_0px_1.41px_3.18px_0px_rgba(255,255,255,0.5)] transition hover:bg-[#1a1440] sm:text-base"
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:justify-between">
        {posts.map((post) => (
          <div key={post._id}>
            <BlogCard
              image={getBlogCoverImage(post)}
              category={t("page.defaultCategory")}
              date={formatBlogDate(post.createdAt, i18n.language)}
              title={post.title}
              buttonLabel={t("page.readMore")}
              href={`/blogs/${post.slug || post._id}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
