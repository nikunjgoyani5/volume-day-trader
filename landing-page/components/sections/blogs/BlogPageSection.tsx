"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Badge from "@/components/ui/badge/Badge";
import SectionTitleWrap from "@/components/ui/heading/Sectiontitlewrap";
import BlogCard from "./BlogCard";
import { fetchPublicBlogs, type BlogPost } from "@/lib/blogs-api";
import {
  formatBlogDate,
  getBlogCoverImage,
} from "@/lib/blog-utils";
import CtaFlowButton from "@/components/ui/cta-flow/CtaFlowButton";

export default function BlogPageSection() {
  const { t, i18n } = useTranslation("translation", { keyPrefix: "blogs" });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const loadBlogs = useCallback(
    async (nextPage: number, search: string, append: boolean) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(false);
      }

      try {
        const result = await fetchPublicBlogs({
          page: nextPage,
          limit: 9,
          search: search || undefined,
        });

        setPosts((current) =>
          append ? [...current, ...result.blogs] : result.blogs,
        );
        setPage(result.page);
        setHasMore(result.hasMore);
      } catch {
        if (!append) {
          setPosts([]);
          setError(true);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    setPage(1);
    loadBlogs(1, debouncedSearch, false);
  }, [debouncedSearch, loadBlogs]);

  const filteredPosts = useMemo(() => posts, [posts]);

  return (
    <div className="mx-auto flex w-full max-w-[1360px] justify-center flex-col items-center">
      <div className="mx-auto w-full max-w-4xl text-center">
        <div className="badge-wrap flex flex-col gap-2">
          <Badge text={t("page.badge")} />
        </div>

        <SectionTitleWrap
          heading={t("page.title")}
          subheading={t("page.description")}
        />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-7 sm:gap-9">
          <div className="group relative w-full max-w-full sm:max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-4 z-10 flex items-center">
              <Search className="h-4 w-4 text-[#999999] transition-colors group-focus-within:text-white sm:h-5 sm:w-5" />
            </div>

            <input
              type="text"
              placeholder={t("page.searchPlaceholder")}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-full border border-white/5 bg-white/5 py-3.5 pl-11 pr-11 text-sm backdrop-blur-md transition-all duration-300 placeholder:text-[#999999] focus:border-white/20 focus:bg-white/10 focus:outline-none sm:py-3 sm:pl-12 sm:pr-12 sm:text-base lg:text-lg"
            />

            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-4 z-10 flex cursor-pointer items-center text-[#C7CCD2] transition-colors hover:text-white"
                aria-label={t("page.clearSearch")}
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="w-full pt-20">
        {loading ? (
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:justify-between">
            {[1, 2, 3, 4, 5, 6].map((item) => (
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
        ) : error ? (
          <div className="py-10 text-center">
            <p className="mb-4 text-base text-[#C7CCD2] sm:text-lg">
              {t("page.error")}
            </p>
            <CtaFlowButton
              type="button"
              label={t("page.tryAgain")}
              onClick={() => loadBlogs(1, debouncedSearch, false)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-base font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            />
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:justify-between">
              {filteredPosts.map((post) => (
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

            {hasMore ? (
              <div className="mt-12 flex justify-center">
                <CtaFlowButton
                  type="button"
                  label={loadingMore ? t("page.loadingMore") : t("page.loadMore")}
                  disabled={loadingMore}
                  onClick={() => loadBlogs(page + 1, debouncedSearch, true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-base font-medium text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            ) : null}
          </>
        ) : (
          <p className="py-10 text-center text-base text-[#C7CCD2] sm:text-lg">
            {debouncedSearch
              ? t("page.noResults", { searchTerm: debouncedSearch })
              : t("page.emptyState")}
          </p>
        )}
      </div>
    </div>
  );
}
