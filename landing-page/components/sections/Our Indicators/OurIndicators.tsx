'use client'

import React, { useLayoutEffect, useRef, useState } from 'react'
import Badge from '@/components/ui/badge/Badge'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionTitleWrap from '@/components/ui/heading/Sectiontitlewrap'

gsap.registerPlugin(ScrollTrigger)

const POINT_KEYS = [
  'point1',
  'point2',
  'point3',
  'point4',
  'point5',
  'point6',
] as const

const tabs = [
  { id: 'volumeEdge' as const, labelKey: 'tabs.volumeEdge' },
  { id: 'smartProfits' as const, labelKey: 'tabs.smartProfits' },
  { id: 'hiddenStrategy' as const, labelKey: 'tabs.hiddenStrategy' },
]

const BULLET_RISE_Y = 44
const BULLET_STAGGER = 0.14
const BULLET_DURATION = 1.05
const IMAGE_REVEAL_DURATION = 1.35
const IMAGE_START_DELAY = 0.12
const SCROLL_START = 'top 92%'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function buildRevealTimeline(
  bullets: HTMLLIElement[],
  image: HTMLImageElement,
) {
  gsap.set(bullets, { autoAlpha: 0, y: BULLET_RISE_Y, force3D: true })
  gsap.set(image, {
    autoAlpha: 0,
    scale: 0,
    transformOrigin: 'center center',
    force3D: true,
  })

  const tl = gsap.timeline({ paused: true, defaults: { overwrite: 'auto' } })

  tl.to(
    bullets,
    {
      autoAlpha: 1,
      y: 0,
      duration: BULLET_DURATION,
      ease: 'power4.out',
      stagger: BULLET_STAGGER,
      force3D: true,
    },
    0,
  )

  tl.to(
    image,
    {
      autoAlpha: 1,
      scale: 1,
      duration: IMAGE_REVEAL_DURATION,
      ease: 'expo.out',
      force3D: true,
    },
    IMAGE_START_DELAY,
  )

  return tl
}

const OurIndicators = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'ourIndicators' })
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('volumeEdge')
  const contentPrefix = `contentByTab.${activeTab}`

  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const bulletRefs = useRef<(HTMLLIElement | null)[]>([])
  const scrollRevealDone = useRef(false)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const activeTimeline = useRef<gsap.core.Timeline | null>(null)

  const playReveal = (tl: gsap.core.Timeline) => {
    scrollRevealDone.current = true
    tl.pause(0)
    tl.play(0)
  }

  const tryPlayIfAlreadyInView = (tl: gsap.core.Timeline) => {
    const content = contentRef.current
    if (!content || scrollRevealDone.current) return

    const { top, bottom } = content.getBoundingClientRect()
    const viewportTrigger = window.innerHeight * 0.92
    if (top < viewportTrigger && bottom > 0) {
      playReveal(tl)
    }
  }

  useLayoutEffect(() => {
    const content = contentRef.current
    const image = imageRef.current
    const bullets = bulletRefs.current.filter(Boolean) as HTMLLIElement[]

    if (!content || !image || bullets.length !== POINT_KEYS.length) return

    if (prefersReducedMotion()) {
      gsap.set(bullets, { autoAlpha: 1, y: 0, clearProps: 'transform' })
      gsap.set(image, { autoAlpha: 1, scale: 1, clearProps: 'transform' })
      return
    }

    activeTimeline.current?.kill()
    scrollTriggerRef.current?.kill()
    scrollTriggerRef.current = null

    const tl = buildRevealTimeline(bullets, image)
    activeTimeline.current = tl

    if (scrollRevealDone.current) {
      playReveal(tl)
      return
    }

    scrollTriggerRef.current = ScrollTrigger.create({
      id: 'our-indicators-reveal',
      trigger: content,
      start: SCROLL_START,
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
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(layoutTimer)
      scrollTriggerRef.current?.kill()
      scrollTriggerRef.current = null
      activeTimeline.current?.kill()
    }
  }, [activeTab])

  return (
    <div className="section-pb">
      <section
        id="our-indicators"
        className="scroll-anchor-offset relative z-10 mx-auto"
      >
        <div className="badge-wrap relative mx-auto flex w-full max-w-[717px] flex-col gap-2 overflow-hidden">
          <Badge text={t('badge')} />
        </div>

        <SectionTitleWrap heading={t('title')} subheading={t('description')} />

        <div className="content-pt flex justify-center px-4 sm:px-6">
          <div
            className={cn(
              'flex w-full max-w-md flex-col gap-1 rounded-xl border border-card-border bg-card-bg p-1',
              'sm:inline-flex sm:w-auto sm:max-w-none sm:flex-row sm:items-center',
            )}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full cursor-pointer rounded-lg px-3 py-2 text-center text-sm font-medium transition-colors',
                  'sm:w-auto sm:px-4 sm:py-2 sm:text-sm md:px-5 md:text-base',
                  activeTab === tab.id
                    ? 'bg-tab-active text-white shadow-control-inset'
                    : 'text-secondary-text hover:text-white',
                )}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={contentRef}
          className="mx-auto mt-6 max-w-[1200px] rounded-3xl border border-card-border bg-card-bg p-4 sm:mt-8 sm:p-6 md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_500px] lg:items-center lg:gap-8">
            <div className="min-w-0 overflow-visible">
              <h3 className="card-heading max-w-[560px] text-left text-xl font-semibold leading-tight text-white sm:text-2xl lg:text-3xl 2xl:text-[40px] 2xl:leading-[1.1]">
                {t(`${contentPrefix}.title`)}
              </h3>
              <p className="card-desc mt-3 max-w-[560px] text-left leading-relaxed sm:mt-4">
                {t(`${contentPrefix}.description`)}
              </p>

              <ul className="our-indicators-bullets relative z-10 mt-4 space-y-2.5 overflow-visible sm:mt-6 sm:space-y-3">
                {POINT_KEYS.map((pointKey, index) => (
                  <li
                    key={`${activeTab}-${pointKey}`}
                    ref={(el) => {
                      bulletRefs.current[index] = el
                    }}
                    className="flex items-start gap-2.5 text-left will-change-transform sm:gap-3"
                  >
                    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-service-accent sm:mt-1 sm:h-5 sm:w-5">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-2.5 w-2.5 fill-none stroke-white sm:h-3 sm:w-3"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm leading-snug text-secondary-text sm:text-base lg:text-lg">
                      {t(`${contentPrefix}.points.${pointKey}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-h-[280px] rounded-2xl  sm:min-h-[360px] sm:rounded-3xl lg:min-h-[400px]">
              <img
                ref={imageRef}
                src="/assets/images/ourindicators.png"
                alt={t('imageAlt')}
                className="block h-full min-h-[280px] w-full origin-center overflow-hidden rounded-2xl object-cover will-change-transform sm:min-h-[360px] sm:rounded-3xl lg:min-h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OurIndicators
