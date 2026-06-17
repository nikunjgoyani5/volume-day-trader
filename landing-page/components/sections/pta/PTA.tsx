'use client'

import { useEffect, useState } from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Badge from '@/components/ui/badge/Badge'
import { cn } from '@/lib/utils'
import SectionTitleWrap from '@/components/ui/heading/Sectiontitlewrap'
// import Heading from '@/components/ui/heading/Heading'
// import SubHeading from '@/components/ui/subheading/SubHeading'
import PTACards from '@/components/sections/pta/PTACards'
import SideGradients from '@/components/common/backgrounds/SideGradients'

const navButtonClass =
  'glass-surface flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:cursor-pointer hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35 sm:h-12 sm:w-12 2xl:h-14 2xl:w-14'

type NavButtonProps = {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
  className?: string
}

function NavButton({ direction, disabled, onClick, className }: NavButtonProps) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  const label = direction === 'prev' ? 'Previous slide' : 'Next slide'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(navButtonClass, className)}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
    </button>
  )
}

const PTA = () => {
  const [api, setApi] = useState<CarouselApi>()
  const { t } = useTranslation('translation', { keyPrefix: 'ptaReports' })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    onSelect()
    api.on('select', onSelect)
    api.on('reInit', onSelect)

    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  return (
    <section id="pta" className="section-pb relative">
      <SideGradients />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 ">
        <div className="badge-wrap relative mx-auto flex w-full max-w-[717px] flex-col gap-2 overflow-hidden">
          <Badge text={t('badge')} />
        </div>

        {/* <div className="section-header-stack relative mx-auto">
          <Heading
            className="mx-auto max-w-[630px] text-balance"
            text={t('title')}
          />
          <SubHeading
            className="mx-auto max-w-2xl text-pretty px-1"
            text={t('description')}
          />
        </div> */}
        <SectionTitleWrap heading={t('title')} subheading={t('description')} />
      </div>

      {/* Carousel block only — does not clip section gradients */}
      <div className="relative z-10 mx-auto w-full max-w-[1165px] px-4 content-pt sm:px-6 lg:px-8">
        <div className="flex flex-col items-stretch gap-5 lg:flex-row lg:items-center lg:gap-4 xl:gap-6">
          <NavButton
            direction="prev"
            disabled={!canScrollPrev}
            onClick={() => api?.scrollPrev()}
            className="hidden shrink-0 lg:flex"
          />

          <div className="min-w-0 flex-1 overflow-hidden">
            <PTACards setApi={setApi} />
          </div>

          <NavButton
            direction="next"
            disabled={!canScrollNext}
            onClick={() => api?.scrollNext()}
            className="hidden shrink-0 lg:flex"
          />

          <div className="flex items-center justify-center gap-4 lg:hidden">
            <NavButton
              direction="prev"
              disabled={!canScrollPrev}
              onClick={() => api?.scrollPrev()}
            />
            <NavButton
              direction="next"
              disabled={!canScrollNext}
              onClick={() => api?.scrollNext()}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default PTA
