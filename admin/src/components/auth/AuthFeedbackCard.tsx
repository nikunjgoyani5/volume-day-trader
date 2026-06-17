import type { ReactNode } from "react";

import AppIcon from "@/components/ui/app-icon";

type FeedbackVariant = "success" | "warning";

type AuthFeedbackCardProps = {
  variant: FeedbackVariant;
  title: string;
  description: string;
  email?: string;
  hint?: string;
  children?: ReactNode;
};

const variantStyles: Record<
  FeedbackVariant,
  { iconBg: string; iconColor: string; ring: string }
> = {
  success: {
    iconBg: "bg-tab-active/15",
    iconColor: "text-tab-active",
    ring: "ring-tab-active/20",
  },
  warning: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    ring: "ring-amber-500/20",
  },
};

function FeedbackIcon({ variant }: { variant: FeedbackVariant }) {
  const { iconColor } = variantStyles[variant];

  return (
    <AppIcon
      name={variant === "warning" ? "exclamation-circle" : "check-circle"}
      className={`h-6 w-6 ${iconColor}`}
      strokeWidth={2}
    />
  );
}

export default function AuthFeedbackCard({
  variant,
  title,
  description,
  email,
  hint,
  children,
}: AuthFeedbackCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ring-1 ${styles.iconBg} ${styles.ring}`}
      >
        <FeedbackIcon variant={variant} />
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-white sm:mt-6 sm:text-xl">
        {title}
      </h3>

      <p className="mt-3 max-w-sm px-1 text-sm leading-6 text-secondary-text sm:px-0">
        {description}
      </p>

      {email && (
        <p
          className="mt-5 w-full max-w-sm truncate rounded-xl border border-btn-border bg-pill-bg px-4 py-3 text-sm font-medium text-white sm:text-base"
          title={email}
        >
          {email}
        </p>
      )}

      {hint && (
        <p className="mt-4 max-w-sm px-2 text-xs leading-5 text-muted-text sm:px-0">
          {hint}
        </p>
      )}

      {children && (
        <div className="mt-6 w-full space-y-3 sm:mt-8 sm:space-y-4">{children}</div>
      )}
    </div>
  );
}
