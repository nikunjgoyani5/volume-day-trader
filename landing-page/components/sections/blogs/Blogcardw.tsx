"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import CtaFlowLabel from "@/components/ui/cta-flow/CtaFlowLabel";
import VectorArrow from "@/components/ui/vector-arrow/VectorArrow";
import { getCtaArrowDelayMs } from "@/lib/motion/flow-text-motion";

interface BlogCardProps {
  href: string;
  imageSrc: string;
  imageAlt?: string;
  date: string;
  readTime: string;
  title: string;
}

export default function BlogCard({
  href,
  imageSrc,
  imageAlt = "",
  date,
  readTime,
  title,
}: BlogCardProps) {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-6 items-start">

      {/* ── Image block ── */}
      <Link
        href={href}
        aria-label="Blog"
        ref={containerRef as any}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-full flex flex-col items-end overflow-hidden"
        style={{ display: "flex" }}
      >
        {/* Main image — skewed/scaled by default, resets on hover */}
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          className="block w-full max-w-full object-cover object-[50%_0%]"
          style={{
            transform: hovered
              ? "translate3d(0px,0px,0px) scale3d(1,1,1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg,0deg)"
              : "translate3d(0px,0px,0px) scale3d(1.2,1.2,1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg,5deg)",
            transformStyle: "preserve-3d",
            transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        {/* Hover overlay — absolute inset-0, overflow hidden, height animates 0 → 100% */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            height: hovered ? "100%" : "0px",
            transition: "height 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            className="w-full max-w-full object-cover object-[50%_0%]"
            style={{
              // Pin the image to the bottom of the reveal container so it appears
              // to wipe up — matches Growra's exact behaviour
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </Link>

      {/* ── Content block ── */}
      <Link
        href={href}
        className="flex flex-col gap-3 w-full no-underline"
        style={{ textDecoration: "none" }}
      >
        {/* Date + read time */}
        <div className="flex items-center gap-2">
          <p className="m-0 text-sm text-[#989898]">{date}</p>
          <p className="m-0 text-sm text-[#989898]">|</p>
          <p className="m-0 text-sm text-[#989898]">{readTime}</p>
        </div>

        {/* Title */}
        <h3
          className="m-0 text-white font-medium leading-snug"
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: "24px",
            letterSpacing: "-0.86px",
          }}
        >
          {title}
        </h3>

        {/* Learn More button */}
        <LearnMoreBtn />
      </Link>
    </div>
  );
}

function LearnMoreBtn() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cta-flow relative flex w-fit cursor-pointer items-center gap-2"
      style={{
        ["--cta-arrow-delay" as string]: `${getCtaArrowDelayMs("Learn More".length)}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CtaFlowLabel
        label="Learn More"
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
          transition: "width 500ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}