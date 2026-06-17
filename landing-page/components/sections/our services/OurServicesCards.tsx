'use client'

import type { FC, SVGProps } from 'react'

import ChartIcon from '@/assets/icons/chart.svg'
import MarketIcon from '@/assets/icons/market.svg'
import GaugeIcon from '@/assets/icons/gauge.svg'
import GradIcon from '@/assets/icons/grad.svg'
import UsersGrpIcon from '@/assets/icons/users-grp.svg'
import ChalkBoardIcon from '@/assets/icons/chalk-board.svg'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'

type SvgIcon = FC<SVGProps<SVGElement>>

interface ServiceCard {
  titleKey: string
  descriptionKey: string
  icon: SvgIcon
}

const services: ServiceCard[] = [
  {
    titleKey: 'cards.ptaSignals.title',
    descriptionKey: 'cards.ptaSignals.desc',
    icon: ChartIcon,
  },
  {
    titleKey: 'cards.marketAnalysis.title',
    descriptionKey: 'cards.marketAnalysis.desc',
    icon: MarketIcon,
  },
  {
    titleKey: 'cards.premiumIndicators.title',
    descriptionKey: 'cards.premiumIndicators.desc',
    icon: GaugeIcon,
  },
  {
    titleKey: 'cards.tradingCourses.title',
    descriptionKey: 'cards.tradingCourses.desc',
    icon: GradIcon,
  },
  {
    titleKey: 'cards.tradingCommunity.title',
    descriptionKey: 'cards.tradingCommunity.desc',
    icon: UsersGrpIcon,
  },
  {
    titleKey: 'cards.practicalSessions.title',
    descriptionKey: 'cards.practicalSessions.desc',
    icon: ChalkBoardIcon,
  },
]

const viewport = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -10% 0px',
} as const

/** Parent only toggles visible — timing is per-card index below. */
const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0, delayChildren: 0 },
  },
}

const CARD_DURATION = 0.54
/** Gap between each card starting (≈ duration → next card after previous is mostly done). */
const CARD_STEP = 0.08

const cardMotionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.95,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * CARD_STEP,
      duration: CARD_DURATION,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const cardReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (index: number) => ({
    opacity: 1,
    transition: {
      delay: index * 0.08,
      duration: 0.2,
      ease: 'easeOut',
    },
  }),
}

const OurServicesCards = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'services' })
  const reduceMotion = useReducedMotion()
  const cardVariants = reduceMotion ? cardReducedVariants : cardMotionVariants

  return (
    <motion.div
      className="content-pt mx-auto grid w-full min-w-0 max-w-screen-2xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {services.map((service, index) => {
        const Icon = service.icon

        return (
          <motion.article
            key={service.titleKey}
            custom={index}
            variants={cardVariants}
            className="service-card card-ui min-w-0 w-full cursor-pointer"
          >
            <span className="service-card__fill" aria-hidden="true" />
            <div className="service-card__content flex h-full min-w-0 flex-col gap-4 sm:gap-5 lg:gap-6">
              <div className="service-icon-accent service-icon-box">
                <Icon className="service-card-icon" aria-hidden />
              </div>

              <div className="flex min-w-0 flex-col gap-2 sm:gap-3">
                <h3 className="card-heading text-left">{t(service.titleKey)}</h3>
                <p className="card-desc text-left">{t(service.descriptionKey)}</p>
              </div>
            </div>
          </motion.article>
        )
      })}
    </motion.div>
  )
}

export default OurServicesCards
