type DashboardSectionHeadingProps = {
  title: string;
  description?: string;
};

export default function DashboardSectionHeading({
  title,
  description,
}: DashboardSectionHeadingProps) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary-text">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-muted-text">{description}</p>
      )}
    </div>
  );
}
