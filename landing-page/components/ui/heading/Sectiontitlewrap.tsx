"use client"

import { gsap } from "gsap"
import type { ReactNode } from "react"
import { useLayoutEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

import { splitHeadingLines } from "./splitHeadingLines"

export interface SectionTitleWrapProps {
  heading: string
  subheading: string
  className?: string
  headingClassName?: string
  subheadingClassName?: string
  /** Animate when scrolled into view (default). false = animate on mount. */
  scrollTrigger?: boolean
  /** Keep the full heading on one line (no auto split). */
  headingSingleLine?: boolean
  /** Default section titles; `hero` keeps homepage hero typography only. */
  variant?: "section" | "hero"
  /** Semantic heading tag (hero uses h1). */
  headingAs?: "h1" | "h2"
  /** Fires when the subheading line starts its reveal (hero CTAs). */
  onDescriptionRevealStart?: () => void
}

export const SECTION_TITLE_REVEAL = {
  duration: 1.05,
  ease: "power2.out" as const,
  lineStagger: 0.2,
  delay: 0.22,
}

const REVEAL_DURATION = SECTION_TITLE_REVEAL.duration
const REVEAL_EASE = SECTION_TITLE_REVEAL.ease
const LINE_STAGGER = SECTION_TITLE_REVEAL.lineStagger
const REVEAL_DELAY = SECTION_TITLE_REVEAL.delay

const REVEAL_FROM = {
  yPercent: 100,
  opacity: 0,
  scale: 0.96,
}

const REVEAL_TO = {
  yPercent: 0,
  opacity: 1,
  scale: 1,
  duration: REVEAL_DURATION,
  ease: REVEAL_EASE,
  overwrite: "auto" as const,
}

function RevealBlock({
  children,
  className,
  maskClassName,
  subheading,
}: {
  children: ReactNode
  className?: string
  maskClassName?: string
  subheading?: boolean
}) {
  return (
    <span className={cn("section-title-wrap__mask", maskClassName)}>
      <span
        data-reveal-inner=""
        {...(subheading ? { "data-reveal-subheading": "" } : {})}
        className={cn("section-title-wrap__line-inner", className)}
      >
        {children}
      </span>
    </span>
  )
}

export default function SectionTitleWrap({
  heading,
  subheading,
  className,
  headingClassName,
  subheadingClassName,
  scrollTrigger = true,
  headingSingleLine = false,
  variant = "section",
  headingAs,
  onDescriptionRevealStart,
}: SectionTitleWrapProps) {
  const isHero = variant === "hero"
  const HeadingTag = headingAs ?? (isHero ? "h1" : "h2")
  const { i18n } = useTranslation()
  const rootRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)
  const revealTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const onDescriptionRevealStartRef = useRef(onDescriptionRevealStart)
  onDescriptionRevealStartRef.current = onDescriptionRevealStart
  const locale = i18n.resolvedLanguage ?? i18n.language

  const headingLines = useMemo(() => {
    const trimmed = heading.trim()
    if (headingSingleLine && trimmed) return [trimmed]
    return splitHeadingLines(heading)
  }, [heading, headingSingleLine])

  const headingLinesKey = headingLines.join("\u0001")

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const inners = root.querySelectorAll<HTMLElement>("[data-reveal-inner]")
    if (!inners.length) return

    hasAnimatedRef.current = false
    revealTimelineRef.current?.kill()
    gsap.killTweensOf(inners)

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const headingCount = headingLines.length
    const headingInners = Array.from(inners).slice(0, headingCount)
    const subheadingInner = root.querySelector<HTMLElement>(
      "[data-reveal-subheading]"
    )

    const fireDescriptionRevealStart = () => {
      onDescriptionRevealStartRef.current?.()
    }

    const runReveal = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true

      revealTimelineRef.current?.kill()
      gsap.killTweensOf(inners)

      if (prefersReducedMotion) {
        gsap.set(inners, { yPercent: 0, opacity: 1, scale: 1 })
        if (subheadingInner) fireDescriptionRevealStart()
        return
      }

      if (subheadingInner) {
        revealTimelineRef.current = gsap.timeline()

        if (headingInners.length) {
          revealTimelineRef.current.fromTo(
            headingInners,
            REVEAL_FROM,
            {
              ...REVEAL_TO,
              delay: REVEAL_DELAY,
              stagger: LINE_STAGGER,
            }
          )
        }

        revealTimelineRef.current.fromTo(
          subheadingInner,
          REVEAL_FROM,
          {
            ...REVEAL_TO,
            onStart: fireDescriptionRevealStart,
          },
          headingInners.length
            ? REVEAL_DELAY + headingInners.length * LINE_STAGGER
            : REVEAL_DELAY
        )
        return
      }

      gsap.fromTo(inners, REVEAL_FROM, {
        ...REVEAL_TO,
        delay: REVEAL_DELAY,
        stagger: LINE_STAGGER,
      })
    }

    if (prefersReducedMotion) {
      gsap.set(inners, { yPercent: 0, opacity: 1, scale: 1 })
      hasAnimatedRef.current = true
      if (subheadingInner) fireDescriptionRevealStart()
      return
    }

    gsap.set(inners, { yPercent: 100, opacity: 0, scale: 0.96 })

    if (!scrollTrigger) {
      const timer = window.setTimeout(runReveal, 120)
      return () => {
        window.clearTimeout(timer)
        revealTimelineRef.current?.kill()
        gsap.killTweensOf(inners)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runReveal()
          observer.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    )

    observer.observe(root)

    if (root.getBoundingClientRect().top < window.innerHeight * 0.92) {
      runReveal()
      observer.disconnect()
    }

    return () => {
      observer.disconnect()
      revealTimelineRef.current?.kill()
      gsap.killTweensOf(inners)
    }
  }, [
    scrollTrigger,
    locale,
    heading,
    subheading,
    headingSingleLine,
    headingLinesKey,
    headingLines.length,
  ])

  return (
    <div
      ref={rootRef}
      className={cn(
        isHero
          ? "section-title-wrap section-title-wrap--hero"
          : "section-title-wrap xl:-mt-16 sm:-mt-13 max-sm:-mt-15 max-[530px]:-mt-7",
        className
      )}
    >
      <HeadingTag
        className={cn(
          "section-title-wrap__heading",
          headingSingleLine && "section-title-wrap__heading--single-line",
          !isHero &&
            !headingSingleLine &&
            heading.trim().length > 42 &&
            "section-title-wrap__heading--long",
          headingClassName
        )}
      >
        {headingLines.map((line, index) => (
          <RevealBlock key={`${locale}-${index}-${line}`}>{line}</RevealBlock>
        ))}
      </HeadingTag>

      {subheading ? (
        <p
          className={cn(
            "section-title-wrap__subheading",
            !isHero &&
              subheading.trim().length > 120 &&
              "section-title-wrap__subheading--long",
            subheadingClassName
          )}
        >
          <RevealBlock key={locale} subheading>
            {subheading}
          </RevealBlock>
        </p>
      ) : null}
    </div>
  )
}
