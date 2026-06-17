import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import BlogPostMeta from "@/components/blogs/BlogPostMeta";
import PageHeader from "@/components/dashboard/PageHeader";
import { useDashboardHeaderActions } from "@/components/dashboard/DashboardHeaderActionsContext";
import { useGetBlogQuery } from "@/redux/blog/blogApi";
import { normalizeBlogStatus } from "@/utils/blogStatus.utils";
import { clearCurrentBlog } from "@/redux/blog/blogSlice";
import { useAppDispatch } from "@/redux/hooks";

function formatDate(iso?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function rtkErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== "object" || !("data" in error)) return null;
  return String((error as { data: unknown }).data);
}

export default function ViewBlogPage() {
  const { blogId = "" } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    data: post,
    isLoading,
    isError,
    error: loadQueryError,
  } = useGetBlogQuery(blogId, { skip: !blogId });

  const { setActions } = useDashboardHeaderActions();

  useEffect(() => {
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch]);

  const canEdit = post
    ? normalizeBlogStatus(post.status) !== "archived"
    : false;

  useEffect(() => {
    if (!canEdit) {
      setActions(null);
      return;
    }

    setActions(
      <Link
        to={`/dashboard/blogs/edit/${blogId}`}
        className="blog-btn-primary inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold no-underline"
      >
        Edit
      </Link>,
    );
    return () => setActions(null);
  }, [setActions, blogId, canEdit]);

  const errorMessage = rtkErrorMessage(loadQueryError);

  if (isLoading && !post) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-sm text-secondary-text">
        Loading blog...
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-white">Post not found</p>
        {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}
        <button
          type="button"
          onClick={() => navigate("/dashboard/blogs")}
          className="cursor-pointer rounded-xl border border-cyan-400/30 px-5 py-2 text-sm text-cyan-400"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  const { editorState } = post;
  const content = editorState.content;

  return (
    <div className="blog-page-enter mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="View Blog"
        description="Read-only preview of this post."
        backTo="/dashboard/blogs"
        backLabel="Back to all blogs"
      />
      <div className="blog-glass-card p-6 sm:p-8">
        <BlogPostMeta
          title={post.title}
          slug={post.slug}
          createdDate={formatDate(post.createdAt)}
          updatedDate={formatDate(post.updatedAt)}
          coverUrl={editorState.coverUrl ?? undefined}
        />

        {content ? (
          <div
            className="blog-article-content blog-preview-fade text-feature-text"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-sm text-secondary-text">No content yet.</p>
        )}
      </div>
    </div>
  );
}
