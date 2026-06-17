"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import SectionTitleWrap from "@/components/ui/heading/Sectiontitlewrap";
import { useTranslation } from "react-i18next";
import BlogsCards from "./BlogsCards";
import CtaFlowLink from "@/components/ui/cta-flow/CtaFlowLink";
import { fetchPublicBlogs, type BlogPost } from "@/lib/blogs-api";

const Blogs = () => {
  const { t } = useTranslation("translation", { keyPrefix: "blogs" });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadBlogs() {
      try {
        const { blogs } = await fetchPublicBlogs({ page: 1, limit: 3 });
        if (!cancelled) {
          setPosts(blogs.slice(0, 3));
        }
      } catch {
        if (!cancelled) {
          setPosts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && posts.length === 0) {
    return null;
  }

  return (
    <section id="blogs" className="scroll-anchor-offset section-pb">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="badge-wrap flex flex-col gap-2">
          <Badge text={t("badge")} />
        </div>

        <SectionTitleWrap heading={t("title")} subheading={t("description")} />
      </div>

      <BlogsCards posts={posts} loading={loading} />

      {!loading && posts.length > 0 ? (
        <div className="mt-12 flex justify-center ">
          <CtaFlowLink
            href="/blogs"
            label={t("allBlogsButton")}
            arrowClassName="h-3 w-3"
            className="flex items-center gap-2 shadow-control-inset rounded-full border border-white/10 bg-white/5 px-6 py-3 text-lg font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          />
        </div>
      ) : null}
    </section>
  );
};

export default Blogs;
