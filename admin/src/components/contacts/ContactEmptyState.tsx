import AppIcon from "@/components/ui/app-icon";

export default function ContactEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-white/[0.04] blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <AppIcon name="chat" className="h-12 w-12 text-secondary-text" strokeWidth={1.25} />
        </div>
      </div>

      <h3 className="mt-8 text-xl font-semibold text-white">
        No contact submissions yet
      </h3>
      <p className="mt-2 max-w-sm text-sm text-secondary-text">
        New inquiries from the website contact form at{" "}
        <span className="text-feature-text">/contact</span> will appear here once
        submitted.
      </p>
    </div>
  );
}
