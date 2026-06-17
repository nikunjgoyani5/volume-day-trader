"use client"

import { gsap } from "gsap"
import type { RefObject } from "react"
import { useLayoutEffect } from "react"

const FROM_Y = 16
const DURATION = 0.38
const GAP_BETWEEN = 0.04
const EASE = "power2.out"

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px 0px -12% 0px",
}

type StaggeredCardsRevealOptions = {
  cardSelector?: string
  /** Delay after each card finishes before the next starts */
  gapBetween?: number
  duration?: number
  ease?: string
  fromY?: number
}

/** Cards reveal in DOM order (1 → 2 → 3 …) when the grid enters the viewport. */
export function useStaggeredCardsReveal(
  rootRef: RefObject<HTMLElement | null>,
  options: StaggeredCardsRevealOptions = {},
  deps: unknown[] = []
) {
  const {
    cardSelector = "[data-stagger-card]",
    gapBetween = GAP_BETWEEN,
    duration = DURATION,
    ease = EASE,
    fromY = FROM_Y,
  } = options

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(cardSelector)
    )
    if (!cards.length) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    let revealed = false

    const revealInOrder = () => {
      if (revealed) return
      revealed = true

      gsap.killTweensOf(cards)

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1, clearProps: "transform" })
        return
      }

      const tl = gsap.timeline({ defaults: { ease, force3D: true } })

      cards.forEach((card, index) => {
        tl.fromTo(
          card,
          { opacity: 0, y: fromY, scale: 0.99 },
          { opacity: 1, y: 0, scale: 1, duration },
          index === 0 ? 0 : `>+${gapBetween}`
        )
      })
    }

    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 })
      return
    }

    cards.forEach((card) => {
      gsap.set(card, {
        opacity: 0,
        y: fromY,
        scale: 0.99,
        force3D: true,
      })
    })

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        revealInOrder()
        observer.disconnect()
      }
    }, OBSERVER_OPTIONS)

    observer.observe(root)

    return () => {
      observer.disconnect()
      gsap.killTweensOf(cards)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardSelector, gapBetween, duration, ease, fromY, ...deps])
}
