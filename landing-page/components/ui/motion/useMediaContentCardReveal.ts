"use client"

import { gsap } from "gsap"
import type { RefObject } from "react"
import { useLayoutEffect } from "react"

const IMAGE_FROM_Y = -200
const IMAGE_DURATION = 1.35
const IMAGE_EASE = "power2.out"

const CONTENT_FROM_Y = 88
const CONTENT_DURATION = 1.2
const CONTENT_EASE = "power2.out"
const CONTENT_AFTER_IMAGE = 0.42

function isCardInViewport(card: HTMLElement) {
  const rect = card.getBoundingClientRect()
  const visibleHeight = window.innerHeight * 0.85
  return rect.top < visibleHeight && rect.bottom > window.innerHeight * 0.08
}

/** Per-card reveal: image from above, content from below (Signals / Wyckoff cards). */
export function useMediaContentCardReveal(
  rootRef: RefObject<HTMLElement | null>,
  deps: unknown[] = []
) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>("[data-signal-card]")
    )
    if (!cards.length) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const animated = new WeakSet<HTMLElement>()

    const setCardHidden = (card: HTMLElement) => {
      const image = card.querySelector<HTMLElement>("[data-signal-image]")
      const content = card.querySelector<HTMLElement>("[data-signal-content]")
      if (!image || !content) return

      if (prefersReducedMotion) {
        gsap.set(image, { y: 0, opacity: 1, scale: 1, force3D: true })
        gsap.set(content, { y: 0, opacity: 1, force3D: true })
        return
      }

      gsap.set(image, {
        y: IMAGE_FROM_Y,
        opacity: 0,
        scale: 0.97,
        force3D: true,
      })
      gsap.set(content, {
        y: CONTENT_FROM_Y,
        opacity: 0,
        force3D: true,
      })
    }

    const revealCard = (card: HTMLElement) => {
      if (animated.has(card)) return
      animated.add(card)

      const image = card.querySelector<HTMLElement>("[data-signal-image]")
      const content = card.querySelector<HTMLElement>("[data-signal-content]")
      if (!image || !content) return

      gsap.killTweensOf([image, content])

      if (prefersReducedMotion) {
        gsap.set(image, { y: 0, opacity: 1, scale: 1 })
        gsap.set(content, { y: 0, opacity: 1 })
        return
      }

      const tl = gsap.timeline()

      tl.fromTo(
        image,
        { y: IMAGE_FROM_Y, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: IMAGE_DURATION,
          ease: IMAGE_EASE,
          force3D: true,
        }
      )

      tl.fromTo(
        content,
        { y: CONTENT_FROM_Y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: CONTENT_DURATION,
          ease: CONTENT_EASE,
          force3D: true,
        },
        CONTENT_AFTER_IMAGE
      )
    }

    cards.forEach(setCardHidden)

    const observers = cards.map((card) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            revealCard(card)
            observer.disconnect()
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
      )

      observer.observe(card)

      if (isCardInViewport(card)) {
        revealCard(card)
        observer.disconnect()
      }

      return observer
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
      cards.forEach((card) => {
        const image = card.querySelector<HTMLElement>("[data-signal-image]")
        const content = card.querySelector<HTMLElement>("[data-signal-content]")
        if (image && content) {
          gsap.killTweensOf([image, content])
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
