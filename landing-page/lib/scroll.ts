import { getLenisInstance } from '@/lib/lenis-instance'
import { NAV_SCROLL_TO_OPTIONS } from '@/lib/scroll-motion'

function parseCssLengthToPx(value: string, context: Element = document.documentElement) {
  const trimmed = value.trim()
  if (!trimmed) return 0

  if (trimmed.endsWith('px')) {
    return Number.parseFloat(trimmed)
  }

  const probe = document.createElement('div')
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.height = trimmed
  context.appendChild(probe)
  const px = probe.getBoundingClientRect().height
  probe.remove()
  return px
}

function getCssAnchorOffsetPx() {
  if (typeof window === 'undefined') return 96

  const root = document.documentElement
  const token =
    window.matchMedia('(min-width: 768px)').matches
      ? '--scroll-anchor-offset-md'
      : '--scroll-anchor-offset'

  const raw = getComputedStyle(root).getPropertyValue(token)
  const parsed = parseCssLengthToPx(raw, root)
  return parsed > 0 ? parsed : 96
}

/** Matches section `scroll-margin-top` / fixed navbar clearance (same as Vercel CSS anchors). */
export function getAnchorScrollOffset(target?: HTMLElement | null) {
  if (target) {
    const scrollMarginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop)
    if (scrollMarginTop > 0) return scrollMarginTop
  }

  const header = document.querySelector('header')
  if (header) {
    const headerBottom = header.getBoundingClientRect().bottom
    const cssOffset = getCssAnchorOffsetPx()
    return Math.max(headerBottom, cssOffset)
  }

  return getCssAnchorOffsetPx()
}

export function scrollToTop() {
  const lenis = getLenisInstance()
  if (lenis) {
    lenis.scrollTo(0, NAV_SCROLL_TO_OPTIONS)
    return true
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
  return true
}

export function scrollToSectionId(sectionId: string) {
  const target = document.getElementById(sectionId)
  if (!target) return false

  const offset = getAnchorScrollOffset(target)
  const lenis = getLenisInstance()

  if (lenis) {
    lenis.scrollTo(target, { offset, ...NAV_SCROLL_TO_OPTIONS })
    return true
  }

  const top = target.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  return true
}
