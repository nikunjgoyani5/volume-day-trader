"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
}

const smoothEase = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <article
      className={cn(
        "w-full rounded-2xl border px-3 py-2.5 transition-[border-color,background-color] duration-300 sm:px-4 sm:py-3",
        isOpen
          ? "border-white/20 bg-white/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full cursor-pointer items-start justify-between gap-3 text-left sm:items-center sm:gap-4"
      >
        <span className="min-w-0 flex-1 text-sm font-normal leading-snug text-white sm:text-base lg:text-lg">
          {question}
        </span>

        {/* Plus → Minus Icon */}
      {/* Plus → Minus Icon */}
<span
  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white sm:mt-0 sm:h-8 sm:w-8"
  aria-hidden
>
  <span className="relative h-3 w-3 sm:h-3.5 sm:w-3.5">
    {/* Vertical bar */}
    <span
      className="absolute left-1/2 top-0 h-full w-[1.8px] rounded-full bg-black origin-center"
      style={{
        transform: isOpen
          ? "translateX(-50%) rotate(90deg)"
          : "translateX(-50%) rotate(0deg)",

        clipPath: isOpen
          ? "inset(45% 0 45% 0)"
          : "inset(0% 0 0% 0)",

        opacity: isOpen ? 0.25 : 1,

        transitionProperty: "transform, clip-path, opacity",
        transitionDuration: "600ms, 600ms, 400ms",
        transitionTimingFunction: `${smoothEase}, ${smoothEase}, ease`,
      }}
    />

    {/* Horizontal bar */}
    <span className="absolute left-0 top-1/2 h-[1.8px] w-full -translate-y-1/2 rounded-full bg-black" />
  </span>
</span>
      </button>

      {/* Accordion body */}
      <div
        id={panelId}
        className={cn(
          "grid overflow-hidden",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
        style={{
          transitionProperty: "grid-template-rows",
          transitionDuration: "520ms",
          transitionTimingFunction: smoothEase,
        }}
      >
        <div className="overflow-hidden min-h-0">
          <p
            className="card-desc pb-0.5 pt-2.5 leading-relaxed sm:pt-3"
            style={{
              transform: isOpen
                ? "translateY(0) scale(1)"
                : "translateY(16px) scale(0.98)",

              opacity: isOpen ? 1 : 0,

              transitionProperty: "transform, opacity",
              transitionDuration: "600ms, 500ms",
              transitionTimingFunction: `${smoothEase}, ${smoothEase}`,
              transitionDelay: isOpen ? "90ms, 90ms" : "0ms, 0ms",

              willChange: "transform, opacity",
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </article>
  );
}