import BlogCoverImageSection from "./BlogCoverImageSection";
import AppIcon from "@/components/ui/app-icon";

const WORD_COUNTS = ["500", "1000", "1500", "2000", "3000"] as const;

type BlogConfigPanelProps = {
  title: string;
  onTitleChange: (v: string) => void;
  slug: string;
  onSlugChange: (v: string) => void;
  regeneratePrompt: string;
  onRegeneratePromptChange: (v: string) => void;
  wordCount: string;
  onWordCountChange: (v: string) => void;
  aiSettingsOpen: boolean;
  onToggleAiSettings: () => void;
  coverUrl: string | null;
  isGenerating: boolean;
  isGeneratingCover?: boolean;
  isUploadingCover?: boolean;
  coverUploadError?: string | null;
  onRegenerateContent: () => void;
  onUploadCover: (file: File) => void;
  onGenerateCover: () => void;
  onDeleteCover: () => void;
};

export default function BlogConfigPanel({
  title,
  onTitleChange,
  slug,
  onSlugChange,
  regeneratePrompt,
  onRegeneratePromptChange,
  wordCount,
  onWordCountChange,
  aiSettingsOpen,
  onToggleAiSettings,
  coverUrl,
  isGenerating,
  isGeneratingCover = false,
  isUploadingCover = false,
  coverUploadError = null,
  onRegenerateContent,
  onUploadCover,
  onGenerateCover,
  onDeleteCover,
}: BlogConfigPanelProps) {
  return (
    <div className="blog-glass-card flex h-full min-h-0 flex-col overflow-hidden">
      <div className="blog-edit-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="blog-title"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-secondary-text"
              >
                Title
              </label>
              <input
                id="blog-title"
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="blog-input w-full"
                placeholder="Blog title"
              />
            </div>
            <div>
              <label
                htmlFor="blog-slug"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-secondary-text"
              >
                URL slug
              </label>
              <input
                id="blog-slug"
                type="text"
                value={slug}
                onChange={(e) => onSlugChange(e.target.value)}
                className="blog-input w-full font-mono text-sm"
                placeholder="my-blog-post"
              />
            </div>
          </div>

          <BlogCoverImageSection
            coverUrl={coverUrl}
            isGenerating={isGeneratingCover}
            isUploading={isUploadingCover}
            uploadError={coverUploadError}
            actionsDisabled={isGenerating}
            onUpload={onUploadCover}
            onGenerateAi={onGenerateCover}
            onDelete={onDeleteCover}
          />

          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            <button
              type="button"
              onClick={onToggleAiSettings}
              className="flex w-full cursor-pointer items-center justify-between bg-white/[0.02] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.04]"
            >
              <span>Regenerate content (AI)</span>
              <AppIcon
                name="chevron-down"
                className={`h-4 w-4 text-secondary-text transition-transform ${aiSettingsOpen ? "rotate-180" : ""}`}
                strokeWidth={2}
              />
            </button>

            {aiSettingsOpen && (
              <div className="space-y-4 border-t border-white/[0.08] p-4">
                <div>
                  <label
                    htmlFor="blog-regen-prompt"
                    className="mb-2 block text-xs font-medium uppercase tracking-wider text-secondary-text"
                  >
                    Prompt
                  </label>
                  <textarea
                    id="blog-regen-prompt"
                    value={regeneratePrompt}
                    onChange={(e) => onRegeneratePromptChange(e.target.value)}
                    rows={4}
                    placeholder="Describe what to generate…"
                    className="blog-input min-h-[100px] w-full resize-y"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-secondary-text">
                    Target word count
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {WORD_COUNTS.map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => onWordCountChange(count)}
                        className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                          wordCount === count
                            ? "bg-tab-active text-white shadow-[0_0_12px_rgb(237_31_36/0.4)]"
                            : "border border-white/[0.08] bg-white/[0.02] text-secondary-text hover:border-tab-active/40 hover:text-white"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onRegenerateContent}
                  disabled={
                    isGenerating || isGeneratingCover || !regeneratePrompt.trim()
                  }
                  className="blog-btn-generate w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating ? "Generating…" : "Regenerate content"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
