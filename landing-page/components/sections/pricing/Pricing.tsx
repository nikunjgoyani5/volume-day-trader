'use client'

import React, { useLayoutEffect, useRef, useState } from 'react'
import Badge from '@/components/ui/badge/Badge'
import CtaFlowLabel from '@/components/ui/cta-flow/CtaFlowLabel'
import SectionTitleWrap from '@/components/ui/heading/Sectiontitlewrap'
// import Heading from '@/components/ui/heading/Heading'
// import SubHeading from '@/components/ui/subheading/SubHeading'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

interface PricingPlan {
  key: string
  href: string
  tag: string
  svg?: string
  title: string
  oldPrice?: string
  price: string
  priceUnit: string
  discount?: string
  features: string[]
  cta: string
  popular?: boolean
  highlighted?: boolean
}

const plans: PricingPlan[] = [
  {
    key: 'wyckoffIndicators',
    href: 'https://volumedaytrader.com/register/indicators-only/',
    tag: 'BEST INDICATORS',
    svg: '/assets/icons/star1.svg',
    title: 'WYCKOFF INDICATORS',
    price: '$67',
    priceUnit: '/Monthly',
    features: [
      'Cumulative Volume Indicator: "Wyckoff Wave Volume"',
      'Cumulative Volume Indicator: "Wyckoff Wave Chart"',
      'Indicators run on the platform: Tradingview',
      'Instructions for installing and adjusting the indicator to different values',
    ],
    cta: 'Buy Now',
  },
  {
    key: 'monthlyAccess',
    href: 'https://volumedaytrader.com/register/monthly/',
    tag: 'RECURRING PAYMENT',
    svg: '/assets/icons/star2.svg',
    title: 'MONTHLY ACCESS',
    price: '$97',
    priceUnit: '/Monthly',
    discount: '31.53% Off',
    features: [
      "Richard Wyckoff's Comprehensive Course",
      'Volume Distribution Analysis [VSA] Course',
      'Daily US PTA Signal Report',
      'Mastering the Richard Wyckoff Method - Practical Classes for Traders',
      'Premium Indicators',
      'Commentary and Market Analysis',
      'Discord Trading Group 24/7',
      'Wyckoff Indicators',
      'Advanced Forex + Price Action Course',
      'Binance for Beginners - Crypto Course',
      'Access to the Community',
    ],
    cta: 'Buy Now',
  },
  {
    key: 'annualAccess',
    href: 'http://volumedaytrader.com/register/yearly/',
    tag: 'LIMITED TIME OFFER',
    svg: '/assets/icons/star3.svg',
    title: 'ANNUAL ACCESS',
    oldPrice: '$1,700',
    price: '$850',
    priceUnit: '/Annual',
    discount: '50% off',
    features: [
      "Richard Wyckoff's Comprehensive Course",
      'Volume Distribution Analysis [VSA] Course',
      'Daily US PTA Signal Report',
      'Mastering the Richard Wyckoff Method - Practical Classes for Traders',
      'Premium Indicators',
      'Commentary and Market Analysis',
      'Discord Trading Group 24/7',
      'Wyckoff Indicators',
      'Advanced Forex + Price Action Course',
      'Binance for Beginners - Crypto Course',
      'Access to the Community',
    ],
    cta: 'Buy Now',
    highlighted: true,
  },
  {
    key: 'lifetimeAccess',
    href: 'https://volumedaytrader.com/register/lifetime/',
    tag: 'MOST POPULAR',
    svg: '/assets/icons/star4.svg',
    title: 'LIFETIME ACCESS',
    oldPrice: '$6,250',
    price: '$1,250',
    priceUnit: '/Lifetime',
    discount: '80% Off',
    features: [
      "Richard Wyckoff's Comprehensive Course",
      'Volume Distribution Analysis [VSA] Course',
      'Daily US PTA Signal Report',
      'Mastering the Richard Wyckoff Method - Practical Classes for Traders',
      'Premium Indicators',
      'Commentary and Market Analysis',
      'Discord Trading Group 24/7',
      'Wyckoff Indicators',
      'Advanced Forex + Price Action Course',
      'Binance for Beginners - Crypto Course',
      'Access to the Community',
    ],
    cta: 'Buy Now',
    popular: true,
  },
]

const RISE_DURATION = 3
const RISE_EASE = 'power3.out'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Start pose per card — outer cards offset more, all rise from center-bottom */
function getCardRiseFrom(index: number) {
  const isLeft = index < 2
  const depth = isLeft ? index : index - 2
  return {
    autoAlpha: 0,
    x: isLeft ? -(96 + depth * 56) : 96 + depth * 56,
    y: 128 + depth * 32,
    scale: 0.96,
    transformOrigin: '50% 100%',
  }
}

function usePricingCardRise(
  sectionRef: React.RefObject<HTMLElement | null>,
  gridRef: React.RefObject<HTMLDivElement | null>,
  cardRefs: React.MutableRefObject<(HTMLElement | null)[]>,
) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    const grid = gridRef.current
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[]
    if (!section || !grid || cards.length !== 4) return

    if (prefersReducedMotion()) {
      gsap.set(cards, { autoAlpha: 1, x: 0, y: 0, scale: 1, clearProps: 'transform' })
      return
    }

    let refreshTimer: ReturnType<typeof setTimeout> | undefined

    const refreshScrollTriggers = () => {
      ScrollTrigger.refresh()
    }

    const scheduleRefresh = () => {
      refreshScrollTriggers()
      requestAnimationFrame(refreshScrollTriggers)
      if (refreshTimer) clearTimeout(refreshTimer)
      refreshTimer = setTimeout(refreshScrollTriggers, 450)
    }

    const onHashChange = () => {
      if (window.location.hash.replace(/^#/, '') === 'pricing') {
        scheduleRefresh()
      }
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: RISE_EASE, overwrite: 'auto' },
        onComplete: () => {
          gsap.set(cards, { clearProps: 'willChange' })
        },
      })

      cards.forEach((card, i) => {
        gsap.set(card, { willChange: 'transform, opacity' })
        tl.fromTo(
          card,
          { ...getCardRiseFrom(i) },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: RISE_DURATION,
            force3D: true,
          },
          0,
        )
      })

      ScrollTrigger.create({
        trigger: grid,
        start: 'top 82%',
        once: true,
        animation: tl,
      })
    }, section)

    scheduleRefresh()

    if (window.location.hash === '#pricing') {
      scheduleRefresh()
    }

    window.addEventListener('load', scheduleRefresh)
    window.addEventListener('hashchange', onHashChange)

    let resizeDebounce: ReturnType<typeof setTimeout>
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeDebounce)
      resizeDebounce = setTimeout(refreshScrollTriggers, 120)
    })
    resizeObserver.observe(grid)

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer)
      clearTimeout(resizeDebounce)
      window.removeEventListener('load', scheduleRefresh)
      window.removeEventListener('hashchange', onHashChange)
      resizeObserver.disconnect()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when grid mounts
  }, [])
}

function PricingPlanCard({
  plan,
  isHighlighted,
  cardRef,
}: {
  plan: PricingPlan
  isHighlighted: boolean
  cardRef: (el: HTMLElement | null) => void
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'pricing' })
  const [hovered, setHovered] = useState(false)
  const buttonLabel = t(`plans.${plan.key}.button`)

  return (
    <article
      ref={cardRef}
      className={`pricing-card-rise min-w-0 overflow-hidden rounded-3xl p-0.5 [transform:translateZ(0)] backface-hidden xl:max-h-fit ${
        isHighlighted
          ? 'bg-service-accent shadow-[0_0_0_1px_rgba(255,46,46,0.2)_inset]'
          : 'bg-pricing-header'
      }`}
    >
      <div
        className={`px-4 py-2 text-center 2xl:text-lg font-semibold ${
          isHighlighted
            ? 'bg-service-accent text-white'
            : 'bg-pricing-header text-pricing-header'
        }`}
      >
        {t(`plans.${plan.key}.tag`)}
      </div>

      <div className="p-5 bg-card-bg rounded-3xl xl:h-fit h-[730px]">
        <h3 className="break-words flex items-center text-md 2xl:text-lg font-semibold uppercase tracking-wide text-white">
          <span>{plan.svg && <img src={plan.svg} alt={t(`plans.${plan.key}.title`)} className="h-6 w-6 inline-block mr-2" />}</span>
          {t(`plans.${plan.key}.title`)}
        </h3>
        <div className="mt-4 flex items-end gap-2">
          {plan.oldPrice ? (
            <span className="md:text-[32px] text-xl font-bold text-[var(--color-oldprice-rgba)] line-through">{plan.oldPrice}</span>
          ) : null}
        </div>

        <div className="mt-1 flex flex-wrap items-end gap-2">
          <span className="text-3xl font-semibold leading-none text-white sm:text-[40px]">{plan.price}</span>
          <span className="pb-1 text-base text-price-unit">/{t(`plans.${plan.key}.duration`)}</span>
          {plan.discount ? (
            <span className="my-auto text-base font-medium text-white bg-[#151032] px-3 py-2 my-auto rounded-3xl">{t(`plans.${plan.key}.discount`)}</span>
          ) : null}
        </div>

        <p className="mt-3 text-base text-secondary-text">{t(`plans.${plan.key}.note`)}</p>

        <a
          href={plan.href}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`cta-flow mt-5 flex w-full cursor-pointer items-center justify-center rounded-full border py-2.5 font-medium text-white no-underline shadow-[inset_0px_1px_3.18px_0px_#FFFFFF80] transition-colors duration-300 hover:border-transparent hover:bg-service-accent md:text-lg ${
            isHighlighted
              ? 'border-transparent bg-service-accent'
              : 'border-btn-border bg-signal-panel-bg'
          }`}
        >
          <CtaFlowLabel label={buttonLabel} hovered={hovered} />
        </a>

        <p className="mt-6 text-lg font-semibold text-white">{t(`plans.${plan.key}.includedTitle`)}</p>
        <ul className="mt-3 space-y-2">
          {plan.features.map((_, featureIndex) => (
            <li key={`${plan.key}-feature-${featureIndex}`} className="flex items-start gap-2 text-lg leading-snug text-feature-text">
              <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-service-accent">
                <svg
                  viewBox="0 0 24 24"
                  className="h-2.5 w-2.5 fill-none stroke-white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="min-w-0 break-words 2xl:text-lg md:text-base text-sm">{t(`plans.${plan.key}.features.feature${featureIndex + 1}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

const Pricing = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'pricing' })
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  usePricingCardRise(sectionRef, gridRef, cardRefs)

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="scroll-anchor-offset relative z-10 mx-auto section-pb"
    >
      <div className="badge-wrap relative mx-auto flex w-full max-w-[717px] flex-col gap-2 overflow-hidden">
        <Badge text={t('badge')} />
      </div>

      {/* <div className="relative z-10 text-center section-header-stack">
        <Heading className="max-w-2xl mx-auto" text={t('title')} />
        <SubHeading className="max-w-[780px] mx-auto" text={t('description')} />
      </div> */}
      <SectionTitleWrap
        heading={t('title')}
        subheading={t('description')}
        headingSingleLine
      />

      <div
        ref={gridRef}
        className="content-pt grid grid-cols-1 gap-5 overflow-visible md:grid-cols-2 xl:grid-cols-4"
      >
        {plans.map((plan, index) => (
          <PricingPlanCard
            key={plan.key}
            plan={plan}
            isHighlighted={plan.highlighted === true}
            cardRef={(el) => { cardRefs.current[index] = el }}
          />
        ))}
      </div>
    </section>
  )
}

export default Pricing