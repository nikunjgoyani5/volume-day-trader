import type { ChangeEvent } from "react";

import BlogCoverImage from "@/components/blogs/BlogCoverImage";
import AppIcon from "@/components/ui/app-icon";

type BlogCoverImageSectionProps = {
  coverUrl: string | null;
  isGenerating?: boolean;
  isUploading?: boolean;
  uploadError?: string | null;
  onUpload: (file: File) => void;
  onGenerateAi: () => void;
  onDelete: () => void;
  actionsDisabled?: boolean;
};

export default function BlogCoverImageSection({
  coverUrl,
  isGenerating = false,
  isUploading = false,
  uploadError = null,
  onUpload,
  onGenerateAi,
  onDelete,
  actionsDisabled = false,
}: BlogCoverImageSectionProps) {
  const busy = isGenerating || isUploading || actionsDisabled;
  const hasCover = Boolean(coverUrl);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  };

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-secondary-text">
        Cover image
      </label>

      <div className="group relative aspect-video overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        {hasCover ? (
          <>
            <BlogCoverImage
              src={coverUrl}
              alt="Blog cover preview"
              className="h-full w-full object-contain"
              fallbackClassName="h-full w-full"
            />
            {busy && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-medium text-white">
                {isUploading ? "Uploading…" : "Generating…"}
              </div>
            )}
            {!busy && (
              <button
                type="button"
                onClick={onDelete}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-black/60 text-red-400 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/80 group-hover:opacity-100"
                aria-label="Delete cover image"
                title="Delete image"
              >
                <AppIcon name="trash" className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-secondary-text">
              {busy ? (isUploading ? "Uploading…" : "Generating…") : "No cover image selected"}
            </p>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="mt-2 text-sm text-red-300" role="alert">
          {uploadError}
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label
          className={`blog-btn-secondary flex-1 text-center ${busy ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
        >
          {hasCover ? "Change Image" : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={handleFileChange}
          />
        </label>
        <button
          type="button"
          onClick={onGenerateAi}
          disabled={busy}
          className="blog-btn-outline flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? "Generating…" : "Generate AI Image"}
        </button>
      </div>
    </div>
  );
}
