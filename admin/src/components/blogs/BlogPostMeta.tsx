import BlogCoverImage from "@/components/blogs/BlogCoverImage";

type BlogPostMetaProps = {
  title: string;
  slug?: string;
  createdDate: string;
  updatedDate?: string;
  coverUrl?: string;
  className?: string;
};

export default function BlogPostMeta({
  title,
  slug,
  createdDate,
  updatedDate,
  coverUrl,
  className = "",
}: BlogPostMetaProps) {
  return (
    <header className={`blog-preview-fade space-y-4 ${className}`}>
      {coverUrl && (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
          <BlogCoverImage
            src={coverUrl}
            alt=""
            className="aspect-video w-full object-cover"
            fallbackClassName="aspect-video w-full"
          />
        </div>
      )}

      <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
        {title}
      </h1>

      <div className="flex flex-wrap gap-4 text-sm text-secondary-text">
        {slug && (
          <span>
            <span className="text-white/60">Slug</span> /{slug}
          </span>
        )}
        <span>
          <span className="text-white/60">Created</span> {createdDate}
        </span>
        {updatedDate && (
          <span>
            <span className="text-white/60">Updated</span> {updatedDate}
          </span>
        )}
      </div>
    </header>
  );
}
