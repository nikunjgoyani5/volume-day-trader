"use client";
import IndicatorSystem from "@/components/sections/Indicator System/IndicatorSystem";
import OurServices from "@/components/sections/our services/OurServices";
import SignalsAndIndicators from "@/components/sections/Signals & Indicators/SignalsAndIndicators";
import Trust from "@/components/sections/Trust/Trust";
import Blogs from "@/components/sections/blogs/Blogs";
import Footer from "@/components/common/footer/Footer";
import OurIndicators from "@/components/sections/Our Indicators/OurIndicators";
import Pricing from "@/components/sections/pricing/Pricing";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import Container from "@/components/layout/container/Container";
import Navbar from '@/components/common/navbar'

import Testimonials from "@/components/sections/testimonials/Testimonials";
import FAQ from "@/components/sections/faq/FAQ";
import Wyckoff from "@/components/sections/wyckoff-indicators/Wyckoff";
import PTA from "@/components/sections/pta/PTA";
import TrustedLogos from "@/components/sections/TrustedLogos/TrustedLogos";
import Hero from "@/components/sections/hero/Hero";
import { useEffect } from "react";
import { scrollToSectionId } from "@/lib/scroll";
import BlogCard from "@/components/sections/blogs/Blogcardw";

export default function Page() {
  useEffect(() => {
    const scrollToHash = () => {
      const sectionId = window.location.hash.replace(/^#/, "")
      if (!sectionId) return
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToSectionId(sectionId)
        })
      })
    }

    scrollToHash()
    window.addEventListener("hashchange", scrollToHash)
    return () => window.removeEventListener("hashchange", scrollToHash)
  }, [])

  return (
    <div className="relative mt-20">
      <Navbar />
      <Hero />
      <TrustedLogos />
      <OurServices />
      <Trust />
      <SignalsAndIndicators />
      <div className="relative overflow-visible bg-page-bg">
        <IndicatorSystem />
        <div
          aria-hidden
          className="pointer-events-none  absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-page-bg via-page-bg/90 to-transparent sm:h-40 lg:h-48"
        />
        <div className="relative z-10">
          <Testimonials />
        </div>
      </div>
      <OurIndicators />
      <Pricing />
      <PTA />
      <Wyckoff />
      <FAQ />
      <Blogs />
    </div>
  );
}