"use client"

import { MarqueeDemoVertical } from '@/components/ui/marquee-demo-vertical'
import Badge from '@/components/ui/badge/Badge'
import SectionTitleWrap from '@/components/ui/heading/Sectiontitlewrap'
// import Heading from '@/components/ui/heading/Heading'
// import SubHeading from '@/components/ui/subheading/SubHeading'
import { useTranslation } from 'react-i18next'

const Testimonials = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'testimonials' })

  return (
    <section id='testimonials' className="section-pb relative z-10 mx-auto">
      <div className="px-4 text-center sm:px-6">
        <div className="badge-wrap flex flex-col gap-2">
          <Badge text={t('badge')} />
        </div>

        {/* <div className="section-header-stack relative z-10 mx-auto">
          <Heading className="mx-auto max-w-xl px-1 sm:px-0" text={t('title')} />
          <SubHeading
            className="mx-auto max-w-[780px] px-2 sm:px-0"
            text={t('description')}
          />
        </div> */}
        <SectionTitleWrap heading={t('title')} subheading={t('description')} />
      </div>

      <MarqueeDemoVertical />
    </section>
  )
}

export default Testimonials
