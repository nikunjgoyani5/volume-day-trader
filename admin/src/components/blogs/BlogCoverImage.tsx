import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type BlogCoverImageProps = {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
};

export default function BlogCoverImage({
  src,
  alt = "",
  className,
  fallbackClassName,
}: BlogCoverImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-white/[0.04] text-xs text-muted-text",
          fallbackClassName ?? className,
        )}
        aria-hidden={!alt}
      >
        -
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
