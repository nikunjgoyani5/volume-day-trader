"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { RefObject } from "react"
import { useLayoutEffect, useRef } from "react"

gsap.registerPlugin(ScrollTrigger)

/** FAQ cards — deeper rise + longer glide (Our Indicators–style, more travel) */
const ITEM_RISE_Y = 96
const ITEM_STAGGER = 0.12
const ITEM_DURATION = 1.4
const ITEM_EASE = "power3.out"
const SCROLL_START = "top 92%"

type FaqStackRevealOptions = {
  itemSelector?: string
  riseY?: number
  stagger?: number
  duration?: number
  ease?: string
  scrollStart?: string
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * FAQ stack reveal — same motion language as Our Indicators bullet points.
 */
export function useFaqStackReveal(
  triggerRef: RefObject<HTMLElement | null>,
  options: FaqStackRevealOptions = {},
  deps: unknown[] = []
) {
  const {
    itemSelector = "[data-faq-reveal]",
    riseY = ITEM_RISE_Y,
    stagger = ITEM_STAGGER,
    duration = ITEM_DURATION,
    ease = ITEM_EASE,
    scrollStart = SCROLL_START,
  } = options

  const scrollRevealDone = useRef(false)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const activeTimeline = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const getItems = () =>
      Array.from(trigger.querySelectorAll<HTMLElement>(itemSelector))

    const items = getItems()
    if (!items.length) return

    const playReveal = (tl: gsap.core.Timeline) => {
      scrollRevealDone.current = true
      tl.pause(0)
      tl.play(0)
    }

    const tryPlayIfAlreadyInView = (tl: gsap.core.Timeline) => {
      if (scrollRevealDone.current) return

      const { top, bottom } = trigger.getBoundingClientRect()
      const viewportTrigger = window.innerHeight * 0.92
      if (top < viewportTrigger && bottom > 0) {
        playReveal(tl)
      }
    }

    if (prefersReducedMotion()) {
      gsap.set(items, { autoAlpha: 1, y: 0, clearProps: "transform" })
      return
    }

    activeTimeline.current?.kill()
    scrollTriggerRef.current?.kill()
    scrollTriggerRef.current = null

    if (scrollRevealDone.current) {
      gsap.set(getItems(), { autoAlpha: 1, y: 0, clearProps: "transform" })
      return
    }

    gsap.set(items, {
      autoAlpha: 0,
      y: riseY,
      scale: 0.98,
      transformOrigin: "center bottom",
      force3D: true,
    })

    const tl = gsap.timeline({
      paused: true,
      defaults: { overwrite: "auto" },
      onComplete: () => {
        gsap.set(items, { clearProps: "willChange" })
      },
    })
    tl.to(
      items,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration,
        ease,
        stagger,
        force3D: true,
      },
      0
    )
    activeTimeline.current = tl

    scrollTriggerRef.current = ScrollTrigger.create({
      id: "faq-stack-reveal",
      trigger,
      start: scrollStart,
      once: true,
      onEnter: () => playReveal(tl),
    })

    const refresh = () => {
      ScrollTrigger.refresh()
      tryPlayIfAlreadyInView(tl)
    }

    refresh()
    requestAnimationFrame(refresh)
    const layoutTimer = window.setTimeout(refresh, 200)
    window.addEventListener("load", refresh)

    return () => {
      window.removeEventListener("load", refresh)
      window.clearTimeout(layoutTimer)
      scrollTriggerRef.current?.kill()
      scrollTriggerRef.current = null
      activeTimeline.current?.kill()
      activeTimeline.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSelector, riseY, stagger, duration, ease, scrollStart, ...deps])
}
