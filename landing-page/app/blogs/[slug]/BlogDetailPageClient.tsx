"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/common/navbar";
import Container from "@/components/layout/container/Container";
import BlogPageBackground from "@/components/sections/blogs/BlogPageBackground";
import BlogDetailView from "@/components/sections/blogs/BlogDetailView";
import SimilarBlogs from "@/components/sections/blogs/SimilarBlogs";
import { fetchPublicBlogBySlug, type BlogPost } from "@/lib/blogs-api";

export default function BlogDetailPageClient() {
  const params = useParams();
  const { t } = useTranslation("translation", { keyPrefix: "blogs" });
  const slug = String(params?.slug ?? "");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;

    async function loadPost() {
      setLoading(true);
      setError(false);

      try {
        const blog = await fetchPublicBlogBySlug(slug);
        if (!cancelled) {
          setPost(blog);
        }
      } catch {
        if (!cancelled) {
          setPost(null);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [slug]);

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-28 md:pt-32 lg:pt-36">
      <BlogPageBackground />

      <Container>
        <Navbar />
      </Container>

      <section className="relative z-10">
        {loading ? (
          <div className="mx-auto flex w-full max-w-[960px] animate-pulse flex-col gap-8 px-4 sm:px-6 lg:px-8">
            <div className="h-10 w-40 rounded-full bg-white/10" />
            <div className="h-12 w-full rounded bg-white/10" />
            <div className="aspect-[16/10] w-full rounded-3xl bg-white/10" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-5/6 rounded bg-white/10" />
              <div className="h-4 w-2/3 rounded bg-white/10" />
            </div>
          </div>
        ) : error || !post ? (
          <div className="mx-auto flex w-full max-w-[960px] flex-col items-center gap-4 px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">
              {t("detail.notFoundTitle")}
            </h1>
            <p className="max-w-xl text-base text-[#C7CCD2] sm:text-lg">
              {t("detail.notFoundDescription")}
            </p>
          </div>
        ) : (
          <>
            <BlogDetailView post={post} />
            <div className="mx-auto mt-12 w-full max-w-[1360px] md:mt-16">
              <SimilarBlogs currentSlug={post.slug || post._id} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
