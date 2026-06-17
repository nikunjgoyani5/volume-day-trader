"use client"

import type { StaticImageData } from "next/image"
import Link from "next/link"
import { useState } from "react"
import CtaFlowLabel from "@/components/ui/cta-flow/CtaFlowLabel"
import VectorArrow from "@/components/ui/vector-arrow/VectorArrow"
import { getCtaArrowDelayMs } from "@/lib/motion/flow-text-motion"
import BlogCoverImage from "./BlogCoverImage"

const REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const IMAGE_REVEAL_MS = "1100ms"
const UNDERLINE_MS = "750ms"

export type BlogCardProps = {
  image: StaticImageData | string
  category: string
  date: string
  title: string
  buttonLabel: string
  href?: string
}

function BlogLearnMore({
  href,
  label,
}: {
  href: string
  label: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      className="cta-flow relative flex w-fit cursor-pointer items-center gap-2 no-underline"
      style={{
        ["--cta-arrow-delay" as string]: `${getCtaArrowDelayMs(label.length)}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CtaFlowLabel
        label={label}
        hovered={hovered}
        shadowColor="#989898"
        className="text-base text-[#989898]"
        style={{
          fontFamily: "'Inter Tight', sans-serif",
          color: "#989898",
        }}
      />

      <span className="inline-flex shrink-0 text-[#989898]">
        <VectorArrow className="h-[21px] w-[21px]" />
      </span>

      <span
        className="absolute bottom-0 left-0 h-px bg-white"
        style={{
          width: hovered ? "100%" : "0%",
          transition: `width ${UNDERLINE_MS} ${REVEAL_EASE}`,
        }}
      />
    </Link>
  )
}

export default function BlogCard({
  image,
  category,
  date,
  title,
  buttonLabel,
  href = "#",
}: BlogCardProps) {
  const [imageHovered, setImageHovered] = useState(false)

  const imageTransform = imageHovered
    ? "translate3d(0px,0px,0px) scale3d(1,1,1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg,0deg)"
    : "translate3d(0px,0px,0px) scale3d(1.2,1.2,1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg,5deg)"

  return (
    <article className="flex w-full min-w-0 flex-col gap-2 rounded-[20px] border border-card-border bg-card-bg p-2 pb-3 shadow-[0px_-4px_100px_21px_#18193333_inset] sm:gap-2.5 sm:rounded-[24px] sm:p-2.5 sm:pb-4">
      <Link
        href={href}
        aria-label={title}
        onMouseEnter={() => setImageHovered(true)}
        onMouseLeave={() => setImageHovered(false)}
        className="relative flex w-full flex-col items-end overflow-hidden rounded-xl sm:rounded-2xl"
      >
        <div className="relative aspect-[4/3] w-full sm:aspect-auto sm:h-[220px] md:h-[250px] lg:h-[276px]">
          <BlogCoverImage
            src={image}
            alt={title}
            className="object-cover object-[50%_0%]"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            style={{
              transform: imageTransform,
              transformStyle: "preserve-3d",
              transition: `transform ${IMAGE_REVEAL_MS} ${REVEAL_EASE}`,
            }}
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              height: imageHovered ? "100%" : "0px",
              transition: `height ${IMAGE_REVEAL_MS} ${REVEAL_EASE}`,
            }}
          >
            <BlogCoverImage
              src={image}
              alt=""
              className="object-cover object-[50%_0%]"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-3 px-2 pb-1 pt-2 sm:gap-4 sm:px-2.5 sm:pb-2.5 sm:pt-3 md:gap-5 md:pt-4">
        <div className="flex flex-col gap-2 sm:gap-2.5">
          <div className="flex flex-wrap items-center gap-2 text-sm sm:gap-2.5">
            <span className="inline-flex items-center justify-center rounded-full bg-[#151032] px-2.5 py-1 text-xs font-medium text-secondary-text shadow-[inset_0px_1.41px_3.18px_0px_rgba(255,255,255,0.5)] sm:px-3 sm:py-1.5 sm:text-sm">
              {category}
            </span>
            <span
              className="h-1 w-1 shrink-0 rounded-full bg-secondary-text"
              aria-hidden
            />
            <span className="text-xs font-medium text-secondary-text sm:text-sm">
              {date}
            </span>
          </div>

          <Link href={href} className="no-underline">
            <h3 className="card-heading m-0 line-clamp-2 text-left text-base font-semibold leading-snug text-white sm:text-lg lg:text-xl">
              {title}
            </h3>
          </Link>
        </div>

        <BlogLearnMore href={href} label={buttonLabel} />
      </div>
    </article>
  )
}
