"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../../../assets/logo/logo.svg'
import { useLanguage } from '@/hooks/use-language'
import { useTranslation } from 'react-i18next'
import { scrollToSectionId, scrollToTop } from '@/lib/scroll'
import CtaFlowLink from '@/components/ui/cta-flow/CtaFlowLink'
import NavLink from './Navlink'

const NAV_LINKS = [
  { id: 'features', labelKey: 'navbar.features', href: '/#features' },
  { id: 'pricing', labelKey: 'navbar.pricing', href: '/#pricing' },
  { id: 'community', labelKey: 'navbar.community', href: '/#community' },
  { id: 'howIndicatorsWork', labelKey: 'navbar.howIndicatorsWork', href: '/how-indicators-work' },
  { id: 'blog', labelKey: 'navbar.blog', href: '/blogs' },
  { id: 'contact', labelKey: 'navbar.contact', href: '/contact' },
] as const

const languages = [
  { code: 'en', label: 'EN', flag: 'https://flagcdn.com/us.svg' },
  { code: 'pl', label: 'PL', flag: 'https://flagcdn.com/pl.svg' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)
  const ticking = useRef(false)
  const { t } = useTranslation('translation')
  const { currentLanguage, changeLanguage } = useLanguage()

  const navLinks = NAV_LINKS.map((link) => ({
    ...link,
    label: t(link.labelKey),
  }))

  const isNavLinkActive = (link: { id: (typeof NAV_LINKS)[number]['id']; href: string }) => {
    if (link.id === 'blog') {
      return pathname === '/blogs' || pathname.startsWith('/blogs/')
    }
    if (link.id === 'howIndicatorsWork') {
      return pathname === '/how-indicators-work'
    }
    if (link.id === 'contact') {
      return pathname === '/contact'
    }
    return pathname === link.href
  }

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (mobileToggleRef.current && mobileToggleRef.current.contains(event.target as Node)) {
        return
      }

      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }

      if (mobileRef.current && !mobileRef.current.contains(event.target as Node)) {
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileOpen(false)
        setLangMenuOpen(false)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useLayoutEffect(() => {
    const syncScrolled = () => setScrolled(window.scrollY > 20)

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        syncScrolled()
        ticking.current = false
      })
    }

    syncScrolled()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pageshow', syncScrolled)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pageshow', syncScrolled)
    }
  }, [])

  const selectedLanguage = languages.find((language) => language.code === currentLanguage) ?? languages[0]
  const shouldSwapLogo = scrolled

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname !== '/') {
      return
    }

    event.preventDefault()
    scrollToTop()
  }

  const handleNavLinkClick = (
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
    setMobileOpen(false)
  }

  return (
    <header className="fixed left-0 top-5 z-50 w-full pointer-events-none md:top-7">
      <div className="relative mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 pointer-events-none">
        <motion.nav
          animate={{
            width: scrolled ? '85.375%' : '100%',
            backgroundColor: scrolled ? 'rgba(21, 16, 50, 0.9)' : 'rgba(21, 16, 50, 0.7)',
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 50,
          }}
          style={{ willChange: 'width' }}
          className="pointer-events-auto relative mx-auto flex min-h-[68px] items-center gap-2.5 rounded-full border border-card-border px-4 py-2 text-[15px] font-normal tracking-[-0.01em] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:min-h-[76px] md:pl-8 xl:gap-2.5 xl:text-[13px] min-[1366px]:text-[14px] min-[1440px]:gap-3 min-[1440px]:text-[14px] 2xl:gap-3 2xl:text-[15px] min-[1920px]:text-[18px]"
        >
          <Link
            href="/"
            aria-label="home"
            onClick={handleLogoClick}
            className="relative flex h-11 w-auto shrink-0 items-center justify-start overflow-hidden cursor-pointer xl:w-[240px]"
          >
            <span className="flex xl:hidden">
              <Image
                src="/assets/images/Union.svg"
                alt="VDLTRA logo"
                width={46}
                height={46}
                className="block h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
              />
            </span>

            <span className="relative hidden h-11 w-full shrink-0 overflow-hidden xl:flex">
              <AnimatePresence initial={false} mode="sync">
                {shouldSwapLogo ? (
                  <motion.span
                    key="union-logo"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-start"
                  >
                    <Image
                      src="/assets/images/Union.svg"
                      alt="VDLTRA logo"
                      width={46}
                      height={46}
                      className="h-11 w-11 shrink-0 object-contain"
                    />
                  </motion.span>
                ) : (
                  <motion.span
                    key="wordmark-logo"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-start"
                  >
                    <Logo
                      className="h-full w-full shrink-0 object-contain"
                      role="img"
                      aria-label="VDLTRA logo"
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </Link>

          <ul className="hidden min-w-0 flex-1 flex-nowrap items-center justify-center gap-4 overflow-visible px-1 text-secondary-text xl:flex min-[1440px]:gap-5 2xl:gap-6 min-[1920px]:gap-8">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(link)

              return (
                <li key={link.id} className="shrink-0">
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={isActive}
                    onClick={(event) => handleNavLinkClick(event, link.href)}
                    className="relative whitespace-nowrap rounded-full px-0.5 py-1 text-center leading-tight transition-colors duration-300 min-[1440px]:px-1"
                  />
                </li>
              )
            })}
          </ul>

          <div className="hidden h-11 shrink-0 items-center justify-end gap-3 xl:flex xl:w-[240px]">
            <div
              ref={langRef}
              className="relative flex h-11 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/5 px-2.5 transition-colors duration-300 hover:bg-white/10 min-[1440px]:min-w-[96px] min-[1440px]:px-3 xl:min-w-[88px]"
            >
              <button
                type="button"
                onClick={() => setLangMenuOpen((value) => !value)}
                className="relative flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap pr-4 text-[13px] font-medium text-white min-[1440px]:pr-5 min-[1440px]:text-[14px] xl:pr-4 2xl:pr-6 2xl:text-[15px]"
                aria-label="Select language"
                aria-expanded={langMenuOpen}
              >
                <span className="flex items-center justify-center gap-2">
                  <img
                    src={selectedLanguage.flag}
                    alt={`${selectedLanguage.code} flag`}
                    className="block h-3.5 w-5 shrink-0 rounded-[2px] object-cover"
                  />
                  <span>{selectedLanguage.label}</span>
                </span>

                <svg
                  className={`absolute right-0 h-3 w-3 shrink-0 transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 top-full z-50 mt-2 flex w-full min-w-[96px] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-[#1D1938] bg-[#0A1129]/95 shadow-2xl backdrop-blur-xl"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-center gap-2 px-4 py-3 text-white/90 transition-colors hover:bg-white/10"
                        onClick={() => {
                          changeLanguage(lang.code as 'en' | 'pl')
                          setLangMenuOpen(false)
                        }}
                      >
                        <img src={lang.flag} alt={lang.code} className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover" />
                        <span className="text-[15px] font-medium leading-none">{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <CtaFlowLink
              href="https://volumedaytrader.com/login/"
              label={t('navbar.signIn')}
              arrowClassName="h-3 w-3"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-tab-active px-3.5 text-[13px] font-medium text-white shadow-[inset_0px_1.41px_3.18px_0px_rgba(255,255,255,0.5)] transition-colors duration-300 hover:bg-[#f52b31] min-[1440px]:px-4 min-[1440px]:text-[14px] 2xl:px-5 2xl:text-[15px]"
            />
          </div>

          <button
            ref={mobileToggleRef}
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 xl:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {mobileOpen ? (
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                ref={mobileRef}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto absolute left-4 right-4 top-full mt-3 overflow-hidden rounded-[28px] border border-card-border bg-[#151032]/96 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl xl:hidden"
              >
                <div className="flex flex-col p-5 sm:p-6">
                  <div className="grid gap-4 border-b border-white/5 pb-5">
                    {navLinks.map((link) => {
                      const isActive = isNavLinkActive(link)

                      return (
                        <NavLink
                          key={link.id}
                          href={link.href}
                          label={link.label}
                          active={isActive}
                          className={`w-full rounded-2xl px-3 py-3 text-left text-base font-medium transition-colors  sm:text-lg ${isActive ? 'bg-white/5' : ''}`}
                          onClick={(event) => {
                            handleNavLinkClick(event, link.href)
                            setMobileOpen(false)
                          }}
                        >
                        </NavLink>
                      )
                    })}
                  </div>

                  <div className="mt-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <CtaFlowLink
                        href="https://volumedaytrader.com/login/"
                        label={t('navbar.signIn')}
                        arrowClassName="h-3 w-3"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-all hover:bg-white/10"
                        onClick={() => setMobileOpen(false)}
                      />
                    </div>

                    <div className="flex items-center justify-center gap-3 border-t border-white/10 pt-5">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          className={`flex items-center  gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${selectedLanguage.code === lang.code ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white hover:cursor-pointer '}`}
                          onClick={() => {
                            changeLanguage(lang.code as 'en' | 'pl')
                            setMobileOpen(false)
                          }}
                        >
                          <img src={lang.flag} alt={lang.code} className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover" />
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </header>
  )
}