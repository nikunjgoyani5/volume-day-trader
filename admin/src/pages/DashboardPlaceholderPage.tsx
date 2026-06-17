type DashboardPlaceholderPageProps = {
  title: string;
  description: string;
};

export default function DashboardPlaceholderPage({
  title,
  description,
}: DashboardPlaceholderPageProps) {
  return (
    <div className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-[var(--shadow-card-inset)] sm:p-8">
      <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-secondary-text sm:text-base">
        {description}
      </p>
    </div>
  );
}
