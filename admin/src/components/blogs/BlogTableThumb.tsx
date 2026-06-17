import { useState } from "react";

import AppIcon from "@/components/ui/app-icon";

const THUMB_WRAP_CLASS =
  "blog-table-thumb-wrap shrink-0 overflow-hidden rounded-lg border border-white/[0.1] bg-white/[0.03]";

type BlogTableThumbProps = {
  src: string | null | undefined;
  title: string;
};

function ImagePlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-0.5">
      <AppIcon name="photo" className="h-4 w-4 text-[#475569]" strokeWidth={1.5} />
      <span className="text-[9px] font-medium uppercase tracking-wide text-[#475569]">
        No image
      </span>
    </div>
  );
}

export default function BlogTableThumb({ src, title }: BlogTableThumbProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={THUMB_WRAP_CLASS} title={`No cover image for ${title}`}>
        <ImagePlaceholder />
      </div>
    );
  }

  return (
    <div className={THUMB_WRAP_CLASS}>
      <img
        src={src}
        alt=""
        className="blog-table-thumb-img"
        onError={() => setFailed(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
