import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BlogArchivedNotice from "@/components/blogs/BlogArchivedNotice";
import PageHeader from "@/components/dashboard/PageHeader";
import BlogConfigPanel from "@/components/blogs/BlogConfigPanel";
import BlogPageActions, {
  type BlogPageActionItem,
} from "@/components/blogs/BlogPageActions";
import BlogEditStatusMeta from "@/components/blogs/BlogEditStatusMeta";
import BlogPreviewPanel from "@/components/blogs/BlogPreviewPanel";
import {
  blogRtkApi,
  BLOG_LIST_TAG,
  BLOG_STATS_TAG,
  BLOG_TAG,
  useGenerateContentMutation,
  useGenerateImageMutation,
  useGetBlogQuery,
  useUpdateBlogMutation,
  useUpdateBlogStatusMutation,
} from "@/redux/blog/blogApi";
import {
  clearCurrentBlog,
  clearGeneratedContent,
  clearGeneratedFeaturedImage,
  markStale,
  setGeneratedContent,
  setGeneratedFeaturedImage,
} from "@/redux/blog/blogSlice";
import {
  selectGeneratedContent,
  selectGeneratedFeaturedImage,
} from "@/redux/blog/blogSelectors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { blogService } from "@/services/blog.service";
import type { BlogStatus, FeaturedImage } from "@/types/blog.types";
import { validateCoverFile } from "@/utils/blogImage.utils";
import { normalizeBlogStatus } from "@/utils/blogStatus.utils";
import { prepareBlogUpdatePayload } from "@/utils/blogUpdate.utils";
import { extractTitleFromHtml, slugifyTitle } from "@/utils/blog.utils";

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

type SaveOptions = {
  targetStatus?: Extract<BlogStatus, "draft" | "published">;
};

export default function EditBlogPage() {
  const { blogId = "" } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const hydratedIdRef = useRef<string | null>(null);
  const savedFeaturedRef = useRef<FeaturedImage | null>(null);

  const generatedContent = useAppSelector(selectGeneratedContent);
  const generatedFeaturedImage = useAppSelector(selectGeneratedFeaturedImage);

  const {
    data: post,
    isLoading,
    isError,
    error: loadQueryError,
  } = useGetBlogQuery(blogId, { skip: !blogId });

  const [updateBlog, { isLoading: isSaving }] = useUpdateBlogMutation();
  const [updateBlogStatus, { isLoading: isUpdatingStatus }] =
    useUpdateBlogStatusMutation();
  const [generateContent, { isPending: isGeneratingContent, error: genContentError }] =
    useGenerateContentMutation();
  const [generateImage, { isPending: isGeneratingImage, error: genImageError }] =
    useGenerateImageMutation();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [regeneratePrompt, setRegeneratePrompt] = useState("");
  const [wordCount, setWordCount] = useState("1000");
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<FeaturedImage | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [contentHtml, setContentHtml] = useState("");
  const [contentKey, setContentKey] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const postStatus = post ? normalizeBlogStatus(post.status) : "draft";
  const isArchived = postStatus === "archived";
  const isDraft = postStatus === "draft";
  const isGenerating = isGeneratingContent || isGeneratingImage;
  const isSavingAction = isSaving || isUploadingCover || isUpdatingStatus;
  const isBusy = isSavingAction || isGenerating;

  const actionError =
    localError ||
    rtkErrorMessage(loadQueryError) ||
    rtkErrorMessage(genContentError) ||
    rtkErrorMessage(genImageError);

  useEffect(() => {
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!post || hydratedIdRef.current === post.id) return;
    hydratedIdRef.current = post.id;
    const { editorState } = post;
    savedFeaturedRef.current = editorState.featuredImage;
    setTitle(editorState.title);
    setSlug(post.slug);
    setRegeneratePrompt(editorState.title);
    setContentHtml(editorState.content);
    setContentKey((k) => k + 1);
    setFeaturedImage(editorState.featuredImage);
    setCoverUrl(editorState.coverUrl);
    setCoverFile(null);
  }, [post]);

  useEffect(() => {
    if (!generatedContent) return;
    const extracted = extractTitleFromHtml(generatedContent);
    if (extracted) {
      setTitle(extracted);
      setSlug(slugifyTitle(extracted));
    }
    setContentHtml(generatedContent);
    setContentKey((k) => k + 1);
    dispatch(clearGeneratedContent());
  }, [generatedContent, dispatch]);

  useEffect(() => {
    if (!generatedFeaturedImage) return;
    setFeaturedImage(generatedFeaturedImage);
    setCoverUrl(generatedFeaturedImage.url);
    setCoverFile(null);
    dispatch(clearGeneratedFeaturedImage());
  }, [generatedFeaturedImage, dispatch]);

  const invalidateBlogCaches = useCallback(
    (id: string) => {
      dispatch(markStale());
      dispatch(
        blogRtkApi.util.invalidateTags([
          { type: BLOG_LIST_TAG, id: "LIST" },
          { type: BLOG_STATS_TAG, id: "STATS" },
          { type: BLOG_TAG, id },
        ]),
      );
    },
    [dispatch],
  );

  const saveNow = useCallback(
    async (options?: SaveOptions) => {
      if (!post?.id || isArchived) return;

      if (isGeneratingContent || isGeneratingImage) {
        setLocalError("Wait for generation to finish before saving.");
        return;
      }

      if (!contentHtml.trim()) {
        setLocalError("Add content before saving.");
        return;
      }

      const payload = prepareBlogUpdatePayload(
        {
          title: title.trim() || "Untitled Blog",
          slug: slug.trim() || undefined,
          content: contentHtml,
          featuredImage: featuredImage ?? undefined,
        },
        {
          featuredImage,
          savedFeaturedImage: savedFeaturedRef.current,
          pendingCoverFile: Boolean(coverFile),
        },
      );

      if (options?.targetStatus) {
        payload.status = options.targetStatus;
      } else if (isDraft) {
        payload.status = "draft";
      }

      if (Object.keys(payload).length === 0 && !coverFile) {
        setLocalError("Nothing to save");
        return;
      }

      setLocalError(null);

      try {
        if (coverFile) {
          setIsUploadingCover(true);
          const updated = await blogService.updateWithCoverFile(
            post.id,
            {
              title: payload.title,
              slug: payload.slug,
              content: payload.content,
              status: payload.status,
            },
            coverFile,
            { savedFeaturedImage: savedFeaturedRef.current },
          );
          savedFeaturedRef.current = updated.featuredImage;
          setFeaturedImage(updated.featuredImage);
          setCoverUrl(updated.coverUrl);
          setCoverFile(null);
          setIsUploadingCover(false);
        } else {
          await updateBlog({
            id: post.id,
            payload,
            savedFeaturedImage: savedFeaturedRef.current,
          }).unwrap();
        }
        invalidateBlogCaches(post.id);
        navigate("/dashboard/blogs");
      } catch (err) {
        setIsUploadingCover(false);
        const message = rtkErrorMessage(err) ?? "Failed to save blog";
        if (coverFile) {
          setCoverUploadError(message);
        } else {
          setLocalError(message);
        }
      }
    },
    [
      post?.id,
      isArchived,
      isDraft,
      isGeneratingContent,
      isGeneratingImage,
      contentHtml,
      title,
      slug,
      featuredImage,
      coverFile,
      updateBlog,
      invalidateBlogCaches,
      navigate,
    ],
  );

  const restoreNow = async () => {
    if (!post?.id || !isArchived) return;
    setLocalError(null);
    try {
      await updateBlogStatus({ id: post.id, status: "published" }).unwrap();
      invalidateBlogCaches(post.id);
      navigate("/dashboard/blogs");
    } catch (err) {
      setLocalError(rtkErrorMessage(err) ?? "Failed to restore blog");
    }
  };

  const runGenerate = useCallback(async () => {
    if (!regeneratePrompt.trim() || isGenerating) return;
    setLocalError(null);
    try {
      const result = await generateContent({
        prompt: regeneratePrompt.trim(),
        targetWordCount: parseInt(wordCount, 10) || undefined,
      }).unwrap();
      dispatch(setGeneratedContent(result.content));
    } catch {
      /* RTK error */
    }
  }, [regeneratePrompt, wordCount, generateContent, dispatch, isGenerating]);

  const runGenerateCover = useCallback(async () => {
    if (isGenerating) return;
    const prompt = title.trim() || regeneratePrompt.trim();
    if (!prompt) return;
    setLocalError(null);
    setCoverUploadError(null);
    try {
      const result = await generateImage({
        prompt,
        previousPublicId: featuredImage?.publicId,
      }).unwrap();
      dispatch(setGeneratedFeaturedImage(result.featuredImage));
    } catch (err) {
      setCoverUploadError(
        rtkErrorMessage(err) ?? "Failed to generate cover image.",
      );
    }
  }, [title, regeneratePrompt, featuredImage, generateImage, dispatch, isGenerating]);

  const handleContentChange = (html: string) => {
    setContentHtml(html);
    const t = extractTitleFromHtml(html);
    if (t) setTitle(t);
  };

  const headerActions = useMemo((): BlogPageActionItem[] => {
    if (isArchived) return [];

    if (isDraft) {
      return [
        {
          id: "save-draft",
          label: "Save Draft",
          onClick: () => void saveNow({ targetStatus: "draft" }),
          variant: "secondary",
          disabled: isBusy,
          loading: isSavingAction,
          loadingLabel: "Saving...",
        },
        {
          id: "publish",
          label: "Publish",
          onClick: () => void saveNow({ targetStatus: "published" }),
          variant: "publish",
          disabled: isBusy,
          loading: isSavingAction,
          loadingLabel: "Publishing...",
        },
      ];
    }

    return [
      {
        id: "save-changes",
        label: "Save Changes",
        onClick: () => void saveNow(),
        variant: "primary",
        disabled: isBusy,
        loading: isSavingAction,
        loadingLabel: "Saving...",
      },
      {
        id: "publish",
        label: "Publish",
        onClick: () => void saveNow({ targetStatus: "published" }),
        variant: "publish",
        disabled: isBusy,
        loading: isSavingAction,
        loadingLabel: "Publishing...",
      },
    ];
  }, [isArchived, isDraft, isBusy, isSavingAction, saveNow]);

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
        {actionError && <p className="text-sm text-red-300">{actionError}</p>}
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

  if (isArchived) {
    return (
      <div className="blog-page-enter space-y-6">
        <PageHeader
          title="Edit Blog"
          description="Update content, cover, and SEO."
        />
        {actionError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {actionError}
          </div>
        )}
        <BlogArchivedNotice
          post={post}
          onRestore={() => void restoreNow()}
          restoring={isUpdatingStatus}
        />
      </div>
    );
  }

  return (
    <div className="blog-page-enter blog-edit-layout flex min-h-0 flex-1 flex-col gap-4 overflow-hidden sm:gap-6">
      <div className="shrink-0 space-y-4">
        <PageHeader
          title="Edit Blog"
          description="Update content, cover, and SEO."
          actions={
            headerActions.length > 0 ? (
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                <BlogEditStatusMeta
                  status={postStatus}
                  updatedAt={post.updatedAt}
                />
                <BlogPageActions actions={headerActions} />
              </div>
            ) : undefined
          }
        />
        {actionError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {actionError}
          </div>
        )}
      </div>

      <div className="grid min-h-0 flex-1 gap-4 sm:gap-6 lg:grid-cols-[380px_1fr] lg:items-stretch xl:grid-cols-[420px_1fr]">
        <aside className="flex min-h-0 flex-col">
          <BlogConfigPanel
            title={title}
            onTitleChange={setTitle}
            slug={slug}
            onSlugChange={setSlug}
            regeneratePrompt={regeneratePrompt}
            onRegeneratePromptChange={setRegeneratePrompt}
            wordCount={wordCount}
            onWordCountChange={setWordCount}
            aiSettingsOpen={aiSettingsOpen}
            onToggleAiSettings={() => setAiSettingsOpen((o) => !o)}
            coverUrl={coverUrl}
            isGenerating={isGeneratingContent}
            isGeneratingCover={isGeneratingImage}
            isUploadingCover={isUploadingCover}
            coverUploadError={coverUploadError}
            onRegenerateContent={() => void runGenerate()}
            onUploadCover={(file) => {
              const validationError = validateCoverFile(file);
              if (validationError) {
                setCoverUploadError(validationError);
                return;
              }
              setCoverUploadError(null);
              if (coverUrl?.startsWith("blob:")) URL.revokeObjectURL(coverUrl);
              setCoverFile(file);
              setFeaturedImage(null);
              setCoverUrl(URL.createObjectURL(file));
            }}
            onGenerateCover={() => void runGenerateCover()}
            onDeleteCover={() => {
              if (coverUrl?.startsWith("blob:")) URL.revokeObjectURL(coverUrl);
              setCoverUrl(null);
              setCoverFile(null);
              setFeaturedImage(null);
              setCoverUploadError(null);
            }}
          />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col">
          <BlogPreviewPanel
            hasPreview={Boolean(contentHtml)}
            title={title}
            slug={slug}
            createdDate={formatDate(post.createdAt)}
            updatedDate={formatDate(post.updatedAt)}
            contentHtml={contentHtml}
            onContentChange={handleContentChange}
            contentKey={contentKey}
            actionsDisabled={isGenerating}
            onCopy={() => void navigator.clipboard.writeText(contentHtml)}
            onRegenerate={() => void runGenerate()}
          />
        </div>
      </div>
    </div>
  );
}
