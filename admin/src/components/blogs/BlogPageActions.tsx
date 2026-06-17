import { cn } from "@/lib/utils";

export type BlogPageActionItem = {
  id: string;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "publish" | "draft" | "archive";
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
};

type BlogPageActionsProps = {
  actions: BlogPageActionItem[];
};

const VARIANT_CLASSES: Record<
  NonNullable<BlogPageActionItem["variant"]>,
  string
> = {
  primary: "blog-btn-primary",
  secondary: "blog-btn-secondary",
  publish: "blog-btn-publish",
  draft: "blog-btn-draft",
  archive: "blog-btn-archive",
};

export default function BlogPageActions({ actions }: BlogPageActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {actions.map((action) => {
        const variant = action.variant ?? "primary";
        const isLoading = Boolean(action.loading);

        return (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled || isLoading}
            className={cn(
              VARIANT_CLASSES[variant],
              "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {isLoading
              ? (action.loadingLabel ?? `${action.label.replace(/\.\.\.$/, "")}...`)
              : action.label}
          </button>
        );
      })}
    </div>
  );
}
