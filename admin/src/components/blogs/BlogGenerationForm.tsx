import { Link } from "react-router-dom";

import AppIcon from "@/components/ui/app-icon";
import {
  CREATE_BLOG_WORD_COUNTS,
} from "@/constants/create-blog.constants";
import { cn } from "@/lib/utils";

export type BlogGenerationFormProps = {
  topic: string;
  onTopicChange: (v: string) => void;
  wordCount: string;
  onWordCountChange: (v: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
};

export default function BlogGenerationForm({
  topic,
  onTopicChange,
  wordCount,
  onWordCountChange,
  isGenerating,
  onGenerate,
}: BlogGenerationFormProps) {
  const trimmedLength = topic.trim().length;
  const canGenerate = trimmedLength > 0 && !isGenerating;

  return (
    <div className="blog-glass-card relative overflow-hidden">
      {isGenerating && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-3xl bg-[#050508]/85 px-6 backdrop-blur-md"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/10" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.08] text-white ring-1 ring-white/15">
              <AppIcon name="sparkles" className="h-6 w-6 animate-pulse" strokeWidth={1.75} />
            </span>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-white">Writing your blog draft…</p>
            <p className="mt-1 text-sm text-secondary-text">AI is generating title, content, and structure</p>
          </div>
        </div>
      )}

      <div className="border-b border-white/[0.06] bg-white/[0.02] px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-feature-text ring-1 ring-white/[0.1]">
              <AppIcon name="sparkles" className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">AI blog generator</h2>
              <p className="mt-0.5 text-sm leading-relaxed text-secondary-text">
                Describe your topic and generate a draft
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/blogs"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-feature-text no-underline transition-colors hover:border-white/20 hover:text-white"
          >
            <AppIcon name="chevron-down" className="h-3.5 w-3.5 rotate-90" strokeWidth={2} />
            All blogs
          </Link>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <section>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <label
                htmlFor="blog-topic"
                className="text-sm font-semibold tracking-tight text-white"
              >
                Blog topic / prompt
              </label>
              <p className="mt-1 text-xs leading-relaxed text-muted-text">
                What should the AI write about?
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-text">{trimmedLength} chars</span>
          </div>
          <textarea
            id="blog-topic"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            rows={6}
            disabled={isGenerating}
            placeholder="Describe the blog you want to generate — audience, angle, and key points…"
            className="blog-input theme-scroll w-full resize-none px-4 py-3.5 leading-relaxed disabled:opacity-60"
          />
        </section>

        <section>
          <div className="mb-3">
            <p className="text-sm font-semibold tracking-tight text-white">Target word count</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-text">
              Choose how long the generated draft should be
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CREATE_BLOG_WORD_COUNTS.map((count) => {
              const selected = wordCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => onWordCountChange(count)}
                  className={cn(
                    "cursor-pointer rounded-xl border px-3.5 py-2 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                    selected
                      ? "border-white/25 bg-white/[0.08] text-white ring-1 ring-white/15"
                      : "border-white/[0.08] bg-white/[0.02] text-secondary-text hover:border-white/15 hover:bg-white/[0.04] hover:text-white",
                  )}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </section>

        <button
          type="button"
          disabled={!canGenerate}
          onClick={onGenerate}
          className="blog-btn-generate flex w-full cursor-pointer items-center justify-center gap-2 py-3.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <AppIcon name="sparkles" className="h-5 w-5" strokeWidth={2} />
          Generate &amp; create blog
        </button>
      </div>
    </div>
  );
}
