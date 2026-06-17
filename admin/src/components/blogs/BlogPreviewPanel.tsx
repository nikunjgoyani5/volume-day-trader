import BlogPostMeta from "@/components/blogs/BlogPostMeta";
import { RichTextEditor } from "@/components/editor";
import AppIcon from "@/components/ui/app-icon";

type BlogPreviewPanelProps = {
  hasPreview: boolean;
  title: string;
  slug?: string;
  createdDate: string;
  updatedDate?: string;
  contentHtml: string;
  onContentChange: (html: string) => void;
  contentKey?: string | number;
  isSaving?: boolean;
  actionsDisabled?: boolean;
  busyLabel?: string;
  saveLabel?: string;
  saveVariant?: "primary" | "publish";
  secondaryLabel?: string;
  secondaryVariant?: "secondary" | "draft" | "archive";
  onSecondaryAction?: () => void;
  secondaryDisabled?: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
  onSave?: () => void;
};

export default function BlogPreviewPanel({
  hasPreview,
  title,
  slug,
  createdDate,
  updatedDate,
  contentHtml,
  onContentChange,
  contentKey,
  isSaving = false,
  actionsDisabled = false,
  busyLabel = "Saving...",
  saveLabel = "Save",
  saveVariant = "primary",
  secondaryLabel,
  secondaryVariant = "secondary",
  onSecondaryAction,
  secondaryDisabled = false,
  onCopy,
  onRegenerate,
  onSave,
}: BlogPreviewPanelProps) {
  const saveDisabled = isSaving || actionsDisabled;
  const saveButtonClass =
    saveVariant === "publish" ? "blog-btn-publish" : "blog-btn-primary";
  const secondaryButtonClass =
    secondaryVariant === "archive"
      ? "blog-btn-archive"
      : secondaryVariant === "draft"
        ? "blog-btn-draft"
        : "blog-btn-secondary";

  return (
    <div className="blog-glass-card flex h-full min-h-0 flex-col overflow-hidden">
      {hasPreview ? (
        <>
          <div className="shrink-0 space-y-3 border-b border-white/[0.08] p-5 sm:p-6 sm:pb-4">
            <BlogPostMeta
              title={title}
              slug={slug}
              createdDate={createdDate}
              updatedDate={updatedDate}
              className="mb-0 space-y-3"
            />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-text">
              Content
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 py-4 sm:px-6">
            <RichTextEditor
              value={contentHtml}
              onChange={onContentChange}
              contentKey={contentKey}
              placeholder="Edit blog content…"
              fillContainer
              className="h-full min-h-0"
            />
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-white/[0.08] bg-[#0d082b]/95 p-4 backdrop-blur-sm sm:gap-3">
            <button
              type="button"
              onClick={onCopy}
              disabled={saveDisabled}
              className="blog-icon-btn disabled:cursor-not-allowed disabled:opacity-50"
              title="Copy HTML"
              aria-label="Copy HTML"
            >
              <AppIcon name="copy" className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              disabled={saveDisabled}
              className="blog-icon-btn disabled:cursor-not-allowed disabled:opacity-50"
              title="Regenerate"
              aria-label="Regenerate"
            >
              <AppIcon name="refresh" className="h-5 w-5" strokeWidth={1.5} />
            </button>
            {(onSecondaryAction && secondaryLabel) || onSave ? (
              <>
                <div className="flex-1" />
                {onSecondaryAction && secondaryLabel && (
                  <button
                    type="button"
                    onClick={onSecondaryAction}
                    disabled={saveDisabled || secondaryDisabled}
                    className={`${secondaryButtonClass} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {secondaryLabel}
                  </button>
                )}
                {onSave ? (
                  <button
                    type="button"
                    onClick={onSave}
                    disabled={saveDisabled}
                    className={`${saveButtonClass} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {isSaving ? busyLabel : saveLabel}
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </>
      ) : (
        <div className="blog-edit-scroll flex flex-1 flex-col overflow-y-auto overscroll-contain p-5 sm:p-8">
          <div className="blog-preview-fade flex min-h-[360px] flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-tab-active/30 bg-tab-active/10 shadow-[0_0_40px_rgb(237_31_36/0.15)]">
              <AppIcon name="document" className="h-10 w-10 text-tab-active" strokeWidth={1.25} />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Your blog editor will appear here
            </h3>
            <p className="mt-2 max-w-sm text-sm text-secondary-text">
              Generate a blog, then edit and save your content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
