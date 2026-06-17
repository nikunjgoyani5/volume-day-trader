import AppIcon, { type AppIconName } from "@/components/ui/app-icon";
import { CREATE_BLOG_EXAMPLE_PROMPTS } from "@/constants/create-blog.constants";
import { cn } from "@/lib/utils";

const TIPS: {
  icon: AppIconName;
  text: string;
  iconColor: string;
}[] = [
  {
    icon: "users",
    text: "Include your target audience (beginners vs. advanced traders).",
    iconColor: "text-sky-300",
  },
  {
    icon: "chart-bar",
    text: "Mention specific indicators, strategies, or market conditions.",
    iconColor: "text-emerald-300",
  },
  {
    icon: "pencil",
    text: "Add a desired tone: educational, analytical, or actionable.",
    iconColor: "text-violet-300",
  },
];

type BlogExamplePromptsProps = {
  topic: string;
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export default function BlogExamplePrompts({
  topic,
  onSelect,
  disabled = false,
}: BlogExamplePromptsProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-secondary-text">
              <AppIcon name="document" className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-white">Example prompts</h3>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-text">
                Click to use as your starting topic
              </p>
            </div>
          </div>
        </div>
        <ul className="space-y-2 p-4">
          {CREATE_BLOG_EXAMPLE_PROMPTS.map((example, index) => {
            const selected = topic.trim() === example;
            return (
              <li key={example}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(example)}
                  className={cn(
                    "group flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                    selected
                      ? "border-white/20 bg-white/[0.06]"
                      : "border-white/[0.06] bg-white/[0.02] hover:-translate-y-px hover:border-white/14 hover:bg-white/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ring-1",
                      selected
                        ? "bg-white/[0.1] text-white ring-white/20"
                        : "bg-white/[0.06] text-muted-text ring-white/[0.08] group-hover:text-white",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm leading-snug",
                      selected ? "font-medium text-white" : "text-feature-text group-hover:text-white",
                    )}
                  >
                    {example}
                  </span>
                  {selected && (
                    <AppIcon
                      name="check"
                      className="ml-auto h-4 w-4 shrink-0 text-white"
                      strokeWidth={2}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-sky-500/15 bg-gradient-to-br from-sky-500/[0.1] via-[#0b0f18]/90 to-violet-500/[0.08] p-5">
        <h3 className="text-base font-semibold tracking-tight text-white">Tips for better drafts</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-secondary-text">
          Help the AI produce a stronger first draft
        </p>
        <ul className="mt-3 space-y-2">
          {TIPS.map((tip) => (
            <li key={tip.text} className="flex items-center gap-2.5">
              <AppIcon
                name={tip.icon}
                className={cn("h-3.5 w-3.5 shrink-0", tip.iconColor)}
                strokeWidth={1.75}
              />
              <span className="text-xs leading-relaxed text-feature-text">{tip.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
