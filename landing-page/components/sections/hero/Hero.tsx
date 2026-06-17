"use client"

import Image from "next/image"
import { useCallback, useLayoutEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { gsap } from "gsap"
import HeroChart from "./HeroChart"
import CtaFlowLink from "@/components/ui/cta-flow/CtaFlowLink"
import SectionTitleWrap, {
    SECTION_TITLE_REVEAL,
} from "@/components/ui/heading/Sectiontitlewrap"
import Aurora from "@/components/ui/aurora/Aurora"
import { Particles } from "@/components/ui/particles"

const HERO_AURORA_COLORS = ["#bb1a1a", "#de2424", "#f03838"] as const

function HeroFeatureTag({ label, compact }: { label: string; compact?: boolean }) {
    return (
        <div
            className={`inline-flex  items-center gap-2 px-3 py-2 rounded-full bg-[#151032] shadow-control-inset
                }`}
        >
            <Image
                src="/assets/icons/check.svg"
                alt=""
                width={22}
                height={22}
                className={`shrink-0 ${compact ? "h-[18px] w-[18px]" : "h-[18px] w-[18px] 2xl:h-[22px] 2xl:w-[22px]"}`}
            />
            <span
                className={`whitespace-nowrap font-medium text-white ${compact ? "text-sm" : "text-lg"
                    }`}
            >
                {label}
            </span>
        </div>
    )
}

export default function Hero() {
    const { t, i18n } = useTranslation()
    const ctaRef = useRef<HTMLDivElement>(null)
    const locale = i18n.resolvedLanguage ?? i18n.language
    const heroTitle = t("hero.title")
    const heroDescription = t("hero.description")

    const revealHeroCtas = useCallback(() => {
        const row = ctaRef.current
        if (!row) return

        const buttons = row.querySelectorAll<HTMLElement>("a")
        const targets = buttons.length ? buttons : [row]

        gsap.killTweensOf(targets)
        gsap.set(targets, { autoAlpha: 0, y: 18, scale: 0.98 })

        gsap.to(targets, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: SECTION_TITLE_REVEAL.duration,
            ease: SECTION_TITLE_REVEAL.ease,
            stagger: buttons.length > 1 ? 0.07 : 0,
            overwrite: "auto",
        })
    }, [])

    useLayoutEffect(() => {
        const row = ctaRef.current
        if (!row) return
        gsap.killTweensOf(row.querySelectorAll("a"))
        gsap.set(row.querySelectorAll("a"), { autoAlpha: 0, y: 18, scale: 0.98 })
    }, [locale, heroTitle, heroDescription])

    const floatingTags = [
        {
            label: t("hero.leftTopTag"),
            className: "left-[3%] top-[14%] 2xl:left-[8%]",
        },
        {
            label: t("hero.leftBottomTag"),
            className: "left-[6%] top-[28%] 2xl:left-[12%]",
        },
        {
            label: t("hero.rightTopTag"),
            className: "right-[3%] top-[14%] 2xl:right-[8%]",
        },
        {
            label: t("hero.rightBottomTag"),
            className: "right-[6%] top-[28%] 2xl:right-[12%]",
        },
    ]

    return (
        <section className="relative -mt-20 left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden">
            {/* Absolute background — scrolls with hero, no scroll listeners */}
            <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
                <Aurora
                    colorStops={[...HERO_AURORA_COLORS]}
                    speed={0.45}
                    amplitude={1.25}
                    className="absolute inset-0 h-full w-full"
                />
                <div className="absolute inset-0 z-[2] h-full w-full">
                    <Particles
                        quantity={100}
                        size={1}
                        ease={16}
                        color="#ffffff"
                        className="h-full w-full opacity-90"
                    />
                </div>
            </div>

            <div className="pointer-events-none absolute inset-0 z-20 hidden xl:block">
                <div className="relative mx-auto h-full w-full max-w-[1500px]">
                    {floatingTags.map((tag, index) => (
                        <div
                            key={tag.label}
                            className={`absolute max-w-[min(220px,18vw)] xl:scale-80 2xl:max-w-[min(240px,18vw)] 2xl:scale-90 ${tag.className}`}
                        >
                            <div className="hero-tag-bounce" style={{ animationDelay: `${index * 90}ms` }}>
                                <HeroFeatureTag label={tag.label} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-30 mx-auto w-full max-w-[872px] px-4 pt-28 text-center sm:px-6 sm:pt-32 md:pt-36 lg:pt-40 2xl:pt-48">
                <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border border-[#1D1938] bg-[#151032] px-2 py-1.5 backdrop-blur-sm sm:gap-2 2xl:gap-3 2xl:px-3 2xl:py-2">
                    <span className="rounded-2xl bg-[#1D1938] px-2 py-0.5 text-[10px] font-normal tracking-wide text-white shadow-control-inset sm:px-2.5 sm:py-1 sm:text-sm 2xl:text-lg">
                        {t("hero.newBadge")}
                    </span>
                    <span className="text-center text-[10px] text-[#A7ADBE] sm:text-sm 2xl:text-lg">
                        {t("hero.badge")}
                    </span>
                </div>

                <SectionTitleWrap
                    variant="hero"
                    heading={heroTitle}
                    subheading={heroDescription}
                    scrollTrigger={false}
                    onDescriptionRevealStart={revealHeroCtas}
                />

                <div
                    ref={ctaRef}
                    className="hero-cta-row mx-auto mt-5 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mt-6 sm:max-w-lg sm:flex-row sm:items-center sm:justify-center sm:gap-4 2xl:mt-8 2xl:max-w-none"
                >
                    <CtaFlowLink
                        href="https://volumedaytrader.com/login/"
                        label={t("hero.primaryButton")}
                        arrowClassName="h-3 w-3"
                        className="btn-primary font-medium w-full justify-center px-5 py-2.5 text-sm sm:w-auto sm:px-6 sm:py-3 sm:text-base 2xl:inline-flex 2xl:px-7 2xl:text-lg shadow-control-inset cursor-pointer"
                    />
                    <CtaFlowLink
                        href="https://volumedaytrader.com/login/"
                        label={t("hero.secondaryButton")}
                        arrowClassName="h-3 w-3"
                        className="inline-flex w-full items-center justify-center shadow-control-inset gap-2 rounded-full border border-[#2B2A56] bg-[#0D082B]/80 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-[#3d3c6e] sm:w-auto sm:px-6 sm:text-base 2xl:px-7 2xl:py-3 2xl:text-lg cursor-pointer "
                    />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:hidden">
                    {floatingTags.map((tag, index) => (
                        <div
                            key={tag.label}
                            className="hero-tag-bounce flex justify-center px-1"
                            style={{ animationDelay: `${index * 90}ms` }}
                        >
                            <HeroFeatureTag label={tag.label} compact />
                        </div>
                    ))}
                </div>
            </div>

            <HeroChart />
        </section>
    )
}
