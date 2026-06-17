import Badge from '@/components/ui/badge/Badge'
import SectionTitleWrap from '@/components/ui/heading/Sectiontitlewrap'
// import Heading from '@/components/ui/heading/Heading'
// import SubHeading from '@/components/ui/subheading/SubHeading'
import React from 'react'
import { useTranslation } from 'react-i18next'
import TrustCards from './TrustCards'
import TrustBackground from '@/components/common/backgrounds/TrustBackground'

const Trust = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'trust' })

  return (
    <section id="community" className="scroll-anchor-offset relative font-bold section-pb">
      <TrustBackground />
      <div className="badge-wrap flex flex-col gap-2">
        <Badge text={t('badge')} />
      </div>
      {/* <div className="relative max-w-3xl z-10 mx-auto text-center section-header-stack">
        <Heading
          className="max-w-[600px] mx-auto"
          text="Trusted By Traders Focused On Smarter Market Analysis"
        />
        <SubHeading
          className="max-w-[770px] mx-auto"
          text="Professional indicators, PTA reports, market insights, and educational trading tools designed to help traders understand market behavior with more structure and confidence."
        />
      </div> */}
      <SectionTitleWrap heading={t('title')} subheading={t('description')} />
      <div className="relative content-pt">
        <TrustCards />
      </div>
    </section>
  )
}

export default Trust
