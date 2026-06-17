import Badge from '@/components/ui/badge/Badge'
import SectionTitleWrap from '@/components/ui/heading/Sectiontitlewrap'
// import Heading from '@/components/ui/heading/Heading'
// import SubHeading from '@/components/ui/subheading/SubHeading'
import React from 'react'
import WyckoffCards from '@/components/sections/wyckoff-indicators/WyckoffCards'
import { useTranslation } from 'react-i18next'

const Wyckoff = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'wyckoffIndicators' })

  return (
    <section className="section-pb">
      <div className="mx-auto max-w-4xl  text-center">
        <div className="badge-wrap flex flex-col gap-2">
          <Badge text={t('badge')} />
        </div>

        {/* <div className="relative z-10 mx-auto section-header-stack">
          <Heading className="max-w-3xl mx-auto" text={t('title')} />
          <SubHeading className="max-w-2xl mx-auto" text={t('description')} />
        </div> */}
        <SectionTitleWrap heading={t('title')} subheading={t('description')} />
      </div>

      <WyckoffCards className="content-pt" />
    </section>
  )
}

export default Wyckoff
