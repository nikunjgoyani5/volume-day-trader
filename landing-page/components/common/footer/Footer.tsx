"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import ErrorLogo from "@/assets/icons/error.png"

import {
    FaYoutube,
    FaDiscord,
    FaTelegram,
    FaInstagram,
    FaXTwitter,
} from 'react-icons/fa6'

import Heading from '@/components/ui/heading/Heading'
import SubHeading from '@/components/ui/subheading/SubHeading'

import Logo from '@/assets/logo/logo.svg'
import sections from '@/assets/images/gradients/footer-gradient.png'
import CtaFlowLink from "@/components/ui/cta-flow/CtaFlowLink";
import FooterBackground from '@/components/common/backgrounds/FooterBackground'
import Container from '@/components/layout/container/Container'
import { useTranslation } from 'react-i18next'
import { Particles } from "@/components/ui/particles";
import { scrollToSectionId } from '@/lib/scroll'

const Footer = () => {
    const { t } = useTranslation('translation')
    const pathname = usePathname()

    const handleFooterLinkClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        href: string
    ) => {
        const hashIndex = href.indexOf('#')
        if (hashIndex === -1) return

        const path = href.slice(0, hashIndex) || '/'
        const sectionId = href.slice(hashIndex + 1)
        if (!sectionId) return

        const onHome = pathname === '/' || pathname === ''
        if (!onHome || (path !== '/' && path !== '')) return

        event.preventDefault()
        scrollToSectionId(sectionId)
        window.history.pushState(null, '', `/#${sectionId}`)
    }

    return (
        <footer id="contact" className="scroll-anchor-offset relative overflow-x-clip pb-10">
            {/* <Container> */}
            <FooterBackground />
            <div className="relative z-10 mx-auto w-full min-w-0">
                {/* CTA */}
                <div className="relative overflow-hidden py-16">
                    {/* Particles only here */}
                    <div className="absolute inset-0 pointer-events-none">
                        <Particles
                            quantity={120}
                            size={1}
                            color="#fff"
                            className="h-full w-full opacity-70"
                            />
                    </div>
                    <div className="space-y-5 px-2 sm:px-0 relative z-10">
                        <Heading text={t('footer.cta.title')} />

                        <SubHeading className="mx-auto max-w-[650px] leading-6" text={t('footer.cta.description')} />
                        <div className="flex justify-center">

                            <CtaFlowLink
                                href="https://volumedaytrader.com/login/"
                                label={t('footer.cta.button')}
                                arrowClassName="h-3 w-3"
                                className="btn-primary shadow-control-inset mt-3"
                                />
                        </div>
                    </div>
                </div>
<Container>
                {/* Footer Grid */}
                <div className="grid min-w-0 grid-cols-1 gap-y-10 gap-x-8 pt-16 sm:pt-20 md:grid-cols-2 lg:grid-cols-[3fr_1fr_1fr_1fr] lg:gap-x-12 xl:pt-24">
                    {/* Left */}
                    <div className="min-w-0 space-y-8 md:col-span-2 lg:col-span-1">
                        <div className="space-y-5">
                            <Link href="/" className="footer-logo block w-full min-w-0 max-w-[280px] sm:max-w-[320px] lg:max-w-[360px]" aria-label="home">
                                <Logo
                                    className="footer-logo h-auto w-full max-w-full object-contain object-left"
                                    role="img"
                                    aria-label="VDLTRA logo"
                                />
                            </Link>

                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-white sm:text-xl">
                                    {t('footer.company.consultationTitle')}
                                </h3>

                                <p className="max-w-full text-sm leading-6 text-secondary-text sm:max-w-md sm:text-base sm:leading-6 lg:max-w-lg">
                                    {t('footer.company.consultationDescription')}
                                </p>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="space-y-4">
                            <p className="text-base font-medium text-white sm:text-lg">
                                {t('footer.company.socialTitle')}
                            </p>

                            <div className="flex flex-wrap items-center gap-3">
                                {[
                                    FaYoutube,
                                    FaDiscord,
                                    FaXTwitter,
                                    FaInstagram,
                                    FaTelegram,
                                ].map((Icon, idx) => (
                                    <div
                                        key={idx}
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-card-border bg-card-bg text-white transition-all duration-300 hover:bg-white hover:text-black"
                                    >
                                        <Icon size={22} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Home */}
                    <div className="flex flex-col gap-3 md:col-span-1">
                        <h3 className="text-lg font-medium text-white sm:text-xl">
                            {t('footer.navigation.home')}
                        </h3>

                        {[
                            { label: t('footer.navigation.indicators'), href: '/#signals' },
                            { label: t('footer.navigation.ptaReports'), href: '/#pta' },
                            { label: t('footer.navigation.pricing'), href: '/#pricing' },
                            { label: t('footer.navigation.tradingCommunity'), href: '/#testimonials' },
                            { label: t('footer.navigation.marketAnalysis'), href: '/#how-indicators-work' },
                        ].map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                className="text-sm text-secondary-text transition-colors duration-300 hover:text-white sm:text-base lg:text-lg"
                                onClick={(event) => handleFooterLinkClick(event, item.href)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col gap-3 md:col-span-1">
                        <h3 className="text-lg font-medium text-white sm:text-xl">
                            {t('footer.resources.title')}
                        </h3>

                        {[
                            { label: t('footer.resources.blogs'), href: '/#blogs' },
                            { label: t('footer.resources.tradingEducation'), href: '/#our-indicators' },
                            { label: t('footer.resources.faq'), href: '/#faq' },
                            // { label: t('footer.resources.affiliateProgram'), href: '/#' },
                        ].map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                className="text-sm text-secondary-text transition-colors duration-300 hover:text-white sm:text-base lg:text-lg"
                                onClick={(event) => handleFooterLinkClick(event, item.href)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-3 md:col-span-1">
                        <h3 className="text-lg font-medium text-tertiary-text sm:text-xl">
                            {t('footer.contact.title')}
                        </h3>

                        {[
                            { label: t('footer.contact.support'), href: '/contact' },
                            { label: t('footer.contact.affiliateSupport'), href: '/contact' },
                        ].map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.href}
                                className="text-sm text-secondary-text transition-colors duration-300 hover:text-white sm:text-base lg:text-lg"
                                onClick={(event) => handleFooterLinkClick(event, item.href)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-12 rounded-2xl border border-card-border bg-card-bg px-4 py-4 sm:mt-16 sm:px-6 sm:py-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <Image
                            src={ErrorLogo}
                            alt="warning icon"
                            className="mt-1 h-5 w-5 shrink-0"
                        />
                        <p className="text-sm leading-6 text-secondary-text sm:text-base sm:leading-6">
                            <span className="font-medium sm:text-base text-xs text-secondary-text">
                                {t('footer.riskDisclaimerLabel')}
                            </span>{' '}
                            {t('footer.riskDisclaimer')}
                        </p>
                    </div>
                </div>
            </Container>
            </div>
        </footer>
    )
}

export default Footer