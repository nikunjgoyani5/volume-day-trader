import Badge from '@/components/ui/badge/Badge'
import SectionTitleWrap from '@/components/ui/heading/Sectiontitlewrap'
// import Heading from '@/components/ui/heading/Heading'
// import SubHeading from '@/components/ui/subheading/SubHeading'
import { useTranslation } from 'react-i18next'
import React from 'react'
import OurServicesCards from './OurServicesCards'

const OurServices = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'services' })

  return (
    <section id="features" className="scroll-anchor-offset section-pb overflow-x-clip">
      <div className="relative z-20 mx-auto w-full max-w-screen-2xl ">
        <div className="badge-wrap relative mx-auto flex max-w-3xl flex-col gap-2">
          <Badge text={t('badge')} />
        </div>

        {/* <div className="section-header-stack relative z-10 mx-auto max-w-2xl text-center">
          <Heading text={t('title')} />
          <SubHeading text={t('description')} />
        </div> */}
        <SectionTitleWrap heading={t('title')} subheading={t('description')} />

        <OurServicesCards />
      </div>
    </section>
  )
}

export default OurServices
