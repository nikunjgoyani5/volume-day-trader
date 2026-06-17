"use client"

import CountUpValue from '@/components/ui/count-up/CountUpValue'
import { useTranslation } from 'react-i18next'

interface TrustCardItem {
  value: string
  title: string
  description: string
}

interface TrustCardsProps {
  items?: TrustCardItem[]
  className?: string
}

const defaultItems: TrustCardItem[] = [
  {
    value: '14,200+',
    title: 'stats.activeTraders.title',
    description: 'stats.activeTraders.desc',
  },
  {
    value: '82%',
    title: 'stats.userSatisfaction.title',
    description: 'stats.userSatisfaction.desc',
  },
  {
    value: '4.7',
    title: 'stats.communityRating.title',
    description: 'stats.communityRating.desc',
  },
  {
    value: '14,200+',
    title: 'stats.globalCommunity.title',
    description: 'stats.globalCommunity.desc',
  },
]

const TrustCards = ({ items = defaultItems, className = '' }: TrustCardsProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'trust' })

  return (
    <div
      className={`mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4 ${className}`.trim()}
    >
      {items.map((item) => (
        <article
          key={item.title}
          className="card-ui rounded-2xl p-5 text-left"
        >
          <div className="flex h-full flex-col">
            <CountUpValue
              value={item.value}
              durationMs={3200}
              className="text-3xl font-normal text-white sm:text-4xl 2xl:text-5xl"
            />

            <div className="mt-13">
              <h3 className="card-heading !mb-0 text-left font-semibold leading-tight text-white">
                {t(item.title)}
              </h3>

              <p className="card-desc line-clamp-4 pt-3 text-left text-secondary-text">
                {t(item.description)}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default TrustCards
