import { useEffect, useMemo, useState } from "react";

import BlogEmptyState from "@/components/blogs/BlogEmptyState";
import PageHeader from "@/components/dashboard/PageHeader";
import BlogPageToolbar from "@/components/blogs/BlogPageToolbar";
import BlogPostsTable from "@/components/blogs/BlogPostsTable";
import StatsCards from "@/components/dashboard/StatsCards";
import BlogStatusFilter, {
  type BlogStatusFilterValue,
} from "@/components/blogs/BlogStatusFilter";
import {
  useDeleteBlogMutation,
  useGetBlogStatsQuery,
  useGetBlogsQuery,
  useUpdateBlogStatusMutation,
} from "@/redux/blog/blogApi";
import { clearStale, markStale } from "@/redux/blog/blogSlice";
import { selectBlogListStale } from "@/redux/blog/blogSelectors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { computeBlogStats } from "@/utils/blog.utils";

const SEARCH_DEBOUNCE_MS = 400;
const PAGE_SIZE = 10;

export default function AllBlogsPage() {
  const dispatch = useAppDispatch();
  const stale = useAppSelector(selectBlogListStale);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [listPage, setListPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BlogStatusFilterValue>("all");

  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlogStatus] = useUpdateBlogStatusMutation();

  const { data: statsData } = useGetBlogStatsQuery();

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(search);
      setListPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [search]);

  const listParams = useMemo(
    () => ({
      page: listPage,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      sortBy: "updatedAt" as const,
      sortOrder: "desc" as const,
    }),
    [listPage, debouncedSearch, statusFilter],
  );

  const filterCounts = {
    all: statsData?.total ?? 0,
    draft: statsData?.draft ?? 0,
    published: statsData?.published ?? 0,
    archived: statsData?.archived ?? 0,
  };

  const statsReady = statsData !== undefined;
  const filterIsKnownEmpty =
    statsReady &&
    statusFilter !== "all" &&
    filterCounts[statusFilter] === 0;

  const { data, isLoading, isFetching, error, refetch } = useGetBlogsQuery(
    listParams,
    { skip: filterIsKnownEmpty },
  );

  useEffect(() => {
    if (stale && !filterIsKnownEmpty) {
      void refetch();
      dispatch(clearStale());
    }
  }, [stale, refetch, dispatch, filterIsKnownEmpty]);

  const posts = filterIsKnownEmpty ? [] : (data?.blogs ?? []);
  const total = filterIsKnownEmpty ? 0 : (data?.total ?? 0);
  const page = data?.page ?? 1;
  const hasMore = filterIsKnownEmpty ? false : (data?.hasMore ?? false);

  const stats = useMemo(() => computeBlogStats(posts), [posts]);

  const errorMessage =
    error && "data" in error ? String(error.data) : null;

  const statCards = [
    { label: "Total Posts", value: filterCounts.all, icon: "document" as const },
    { label: "Drafts", value: filterCounts.draft, icon: "pencil" as const },
    { label: "Published", value: filterCounts.published, icon: "check-circle" as const },
    { label: "This Month", value: stats.thisMonth, icon: "calendar" as const },
  ];

  const handleListMutation = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      dispatch(markStale());
      void refetch();
    } catch {
      /* RTK surfaces errors on hook if needed */
    }
  };

  const handleStatusFilterChange = (value: BlogStatusFilterValue) => {
    setStatusFilter(value);
    setListPage(1);
  };

  const pageHeader = (
    <PageHeader
      title="All Blogs"
      description="Manage published, draft, and archived blog posts."
    />
  );

  const toolbar = (
    <BlogPageToolbar
      search={search}
      onSearchChange={setSearch}
      onRefresh={() => void refetch()}
      refreshing={isFetching}
    />
  );

  const hasAnyBlogs = filterCounts.all > 0;

  if (isLoading && posts.length === 0 && !filterIsKnownEmpty) {
    return (
      <div className="blog-page-enter space-y-6">
        {pageHeader}
        {toolbar}
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] text-sm text-secondary-text">
          Loading blogs...
        </div>
      </div>
    );
  }

  if (errorMessage && posts.length === 0 && !hasAnyBlogs) {
    return (
      <div className="blog-page-enter space-y-6">
        {pageHeader}
        {toolbar}
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-sm text-red-300">{errorMessage}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 cursor-pointer rounded-xl bg-tab-active px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-tab-active-hover"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!hasAnyBlogs && !debouncedSearch) {
    return (
      <div className="blog-page-enter space-y-6">
        {pageHeader}
        {toolbar}
        <BlogEmptyState />
      </div>
    );
  }

  return (
    <div className="blog-page-enter space-y-6">
      {pageHeader}
      {toolbar}
      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}
      <StatsCards stats={statCards} />
      <BlogStatusFilter
        value={statusFilter}
        onChange={handleStatusFilterChange}
        counts={filterCounts}
      />
      <div className="blog-glass-card overflow-hidden !transform-none">
        <BlogPostsTable
          posts={posts}
          loading={false}
          onDelete={(id) =>
            void handleListMutation(() => deleteBlog(id).unwrap())
          }
          onPublish={(id) =>
            void handleListMutation(() =>
              updateBlogStatus({ id, status: "published" }).unwrap(),
            )
          }
          onArchive={(id) =>
            void handleListMutation(() =>
              updateBlogStatus({ id, status: "archived" }).unwrap(),
            )
          }
          onRestore={(id) =>
            void handleListMutation(() =>
              updateBlogStatus({ id, status: "published" }).unwrap(),
            )
          }
        />
      </div>
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between text-sm text-secondary-text">
          <span>
            Page {page} · {posts.length} of {total}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={listPage <= 1}
              onClick={() => setListPage((p) => Math.max(1, p - 1))}
              className="cursor-pointer rounded-lg border border-white/[0.08] px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!hasMore}
              onClick={() => setListPage((p) => p + 1)}
              className="cursor-pointer rounded-lg border border-white/[0.08] px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
