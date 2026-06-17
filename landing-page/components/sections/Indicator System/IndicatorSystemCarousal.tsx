"use client"

import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface IndicatorSlide {
  title: string
  subtitle: string
  points: string[]
  linePath: string
  imageSrc?: string
  imageAlt?: string
}

interface IndicatorSystemCarousalProps {
  slides?: IndicatorSlide[]
  className?: string
}

const carouselNavButtonClass =
  'glass-surface flex shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-opacity hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 h-10 w-10 sm:h-11 sm:w-11 md:h-11 md:w-11'

const defaultSlides: IndicatorSlide[] = [
  {
    title: 'cards.waveIndicator.title',
    subtitle: 'cards.waveIndicator.desc',
    points: [
      'cards.waveIndicator.slide1.point1',
      'cards.waveIndicator.slide1.point2',
      'cards.waveIndicator.slide1.point3',
      'cards.waveIndicator.slide1.point4',
    ],
    linePath:
      'M8 98 L28 70 L46 82 L66 58 L82 64 L100 54 L118 62 L138 52 L156 80 L176 88 L194 72 L212 92 L232 86 L252 108',
    imageSrc: '/assets/images/chart2.png',
    imageAlt: 'Chart analysis preview',
  },
  {
    title: 'cards.waveIndicator.title',
    subtitle: 'cards.waveIndicator.slide2.subtitle',
    points: [
      'cards.waveIndicator.slide2.point1',
      'cards.waveIndicator.slide2.point2',
      'cards.waveIndicator.slide2.point3',
      'cards.waveIndicator.slide2.point4',
    ],
    linePath:
      'M8 88 L26 66 L46 74 L66 70 L86 82 L104 62 L124 52 L144 68 L164 64 L184 90 L204 100 L224 92 L244 86 L252 74',
    imageSrc: '/assets/images/chart2.png',
    imageAlt: 'Chart analysis preview',
  },
]

// ─── Chart Panel ─────────────────────────────────────────────────────────────

const ChartPanel = ({
  path,
  imageSrc,
  imageAlt,
}: {
  path: string
  imageSrc?: string
  imageAlt?: string
}) => {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    // Larger media area on desktop so image/content columns align better.
    <div
      className="relative w-full overflow-hidden rounded-xl border indicator-chart-panel aspect-video min-h-[190px] sm:min-h-[210px] xl:h-full xl:min-h-[300px] xl:aspect-auto"
      style={{ position: "relative" }}
    >
      {imageSrc && !imageFailed ? (
        <Image
          src={imageSrc}
          alt={imageAlt ?? 'Indicator chart'}
          fill
          sizes="(max-width: 767px) 90vw, 45vw"
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <svg viewBox="0 0 260 120" className="absolute inset-0 h-full w-full p-3">
          {[16, 36, 56, 76, 96, 116].map((y) => (
            <line key={y} x1="0" y1={y} x2="260" y2={y} stroke="var(--color-indicator-grid-1)" strokeDasharray="4 4" opacity="0.55" />
          ))}
          {[20, 52, 84, 116, 148, 180, 212, 244].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="120" stroke="var(--color-indicator-grid-2)" opacity="0.5" />
          ))}
          <path d={path} fill="none" stroke="var(--color-indicator-path)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}

// ─── Carousel ────────────────────────────────────────────────────────────────

const IndicatorSystemCarousal = ({
  slides = defaultSlides,
  className = '',
}: IndicatorSystemCarousalProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'indicators' })
  const [activeIndex, setActiveIndex] = useState(0)
  const totalSlides = slides.length

  // 90% on mobile, 75% on desktop — drives both width & translate
  const [slideWidthPct, setSlideWidthPct] = useState(75)

  useEffect(() => {
    const update = () => setSlideWidthPct(window.innerWidth < 768 ? 90 : 70)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const GAP_REM = 1.5

  const trackStyle = useMemo(
    () => ({
      transform: `translateX(calc(-${activeIndex * slideWidthPct}% - ${activeIndex * GAP_REM}rem))`,
    }),
    [activeIndex, slideWidthPct]
  )

  const canGoPrev = activeIndex > 0
  const canGoNext = activeIndex < totalSlides - 1

  return (
    <div className={`relative content-pt w-full mx-auto overflow-visible ${className}`.trim()}>
      <div className="relative z-10">
      {/* Clipping viewport */}
      <div className="w-full overflow-visible">
        <div
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={trackStyle}
        >
          {slides.map((slide, idx) => (
            <article
              key={`${slide.title}-${idx}`}
              className="shrink-0 rounded-3xl border border-card-border bg-card-bg p-3
                         flex flex-col
                         xl:grid xl:min-h-[360px] xl:grid-cols-[1.25fr_1fr] xl:items-stretch"
              style={{ width: `${slideWidthPct}%` }}
            >
              {/* Image — always on top on mobile, left on desktop */}
              <div className="p-2 xl:h-full xl:pr-2">
                <ChartPanel
                  path={slide.linePath}
                  imageSrc={slide.imageSrc}
                  imageAlt={slide.imageAlt}
                />
              </div>

              {/* Text — below image on mobile, right column on desktop */}
              <div className="px-4 py-4 md:py-2 xl:flex xl:h-full xl:flex-col xl:justify-center xl:pl-2">
                <h3 className="card-heading text-left font-semibold text-white">
                  {t(slide.title)}
                </h3>
                <p className="card-desc mt-3 text-secondary-text xl:line-clamp-5">
                  {t(slide.subtitle)}
                </p>
                <ul className="card-desc mt-4 xl:line-clamp-5 line-clamp-4">
                  {slide.points.map((point) => (
                    <li key={point}>{t(point)}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="relative mt-4 flex w-full items-center justify-center gap-3 sm:mt-6 sm:gap-4">
        <button
          type="button"
          onClick={() => canGoPrev && setActiveIndex((prev) => prev - 1)}
          disabled={!canGoPrev}
          aria-label="Previous slide"
          className={carouselNavButtonClass}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          type="button"
          onClick={() => canGoNext && setActiveIndex((prev) => prev + 1)}
          disabled={!canGoNext}
          aria-label="Next slide"
          className={carouselNavButtonClass}
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
      </div>

    </div>
  )
}

export default IndicatorSystemCarousal