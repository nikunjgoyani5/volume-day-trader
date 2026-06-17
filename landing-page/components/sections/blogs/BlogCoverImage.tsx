"use client";

import Image, { type StaticImageData } from "next/image";

type BlogCoverImageProps = {
  src: StaticImageData | string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
};

export default function BlogCoverImage({
  src,
  alt,
  className,
  style,
  sizes,
  priority = false,
  fill = true,
}: BlogCoverImageProps) {
  if (typeof src === "string") {
    if (!src) {
      return (
        <div
          className={`${className ?? ""} bg-[#151032]`}
          style={style}
          aria-hidden
        />
      );
    }

    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${className ?? ""}`}
          style={style}
          loading={priority ? "eager" : "lazy"}
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      style={style}
      sizes={sizes}
    />
  );
}
