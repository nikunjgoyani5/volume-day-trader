'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Chart from '@/assets/images/chart/chart2.png'
import { useTranslation } from 'react-i18next'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

interface PTACardItem {
  key: 'buyZoneDetection' | 'liquidityAnalysis' | 'marketStructureMapping' | 'momentumConfirmation'
  title: string
  description: string
}

interface PTACardsProps {
  items?: PTACardItem[]
  className?: string
  setApi?: (api: CarouselApi) => void
}

const defaultItems: PTACardItem[] = [
  {
    key: 'buyZoneDetection',
    title: 'PTA Buy Zone Detection',
    description:
      'Highlights probable buy zones by combining structured volume with recent price action to surface areas where buying pressure may resume.',
  },
  {
    key: 'liquidityAnalysis',
    title: 'Volume & Liquidity Analysis',
    description:
      'Analyzes volume clusters and liquidity to indicate potential breakout or distribution regions and assess trade conviction.',
  },
  {
    key: 'marketStructureMapping',
    title: 'Market Structure Mapping',
    description:
      'Tracks key support and resistance zones based on volume concentration and historical reactions.',
  },
  {
    key: 'momentumConfirmation',
    title: 'Momentum Confirmation',
    description:
      'Identifies momentum shifts using volume expansion and directional strength.',
  },
]

const PTACards = ({
  items = defaultItems,
  className = '',
  setApi,
}: PTACardsProps) => {
  const apiRef = useRef<CarouselApi | undefined>(undefined)
  const { t } = useTranslation('translation', { keyPrefix: 'ptaReports.cards' })

  const handleSetApi = useCallback(
    (api: CarouselApi) => {
      apiRef.current = api
      setApi?.(api)
    },
    [setApi]
  )

  useEffect(() => {
    const onResize = () => apiRef.current?.reInit()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: false,
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
        dragFree: false,
      }}
      setApi={handleSetApi}
      className={cn('w-full', className)}
    >
      <CarouselContent className="-ml-4 sm:-ml-5">
        {items.map((item, index) => (
          <CarouselItem
            key={item.key}
            className="basis-full pl-4 sm:pl-5 md:basis-1/2 hover:cursor-pointer"
          >
            <article className="flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-[#1D1938] bg-[#0D082B] p-4 sm:gap-5 sm:p-5 md:p-6">
              <div
                className="relative aspect-[526/324] w-full overflow-hidden rounded-xl sm:rounded-[20px]"
                style={{ position: "relative" }}
              >
                <Image
                  src={Chart}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1535px) min(100vw, 1165px), 560px"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              <div className="flex flex-col gap-3 sm:gap-4">
                <h3 className="card-heading text-left text-lg font-semibold text-white sm:text-xl">
                   {t(`${item.key}.title`)}
                </h3>
                <p className="card-desc text-left text-sm leading-relaxed text-[#A7ADBE] sm:text-base">
               {t(`${item.key}.desc`)}
                </p>
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default PTACards
