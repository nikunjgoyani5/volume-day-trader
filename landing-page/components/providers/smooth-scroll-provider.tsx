"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { setLenisInstance } from "@/lib/lenis-instance"

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.055,
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      anchors: false,
    })

    setLenisInstance(lenis)
    document.documentElement.classList.add("lenis", "lenis-smooth")

    const resetScrollToTop = () => {
      if (window.location.hash) return
      lenis.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
    }

    resetScrollToTop()

    const onLenisScroll = () => ScrollTrigger.update()
    lenis.on("scroll", onLenisScroll)

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) resetScrollToTop()
    }
    window.addEventListener("pageshow", onPageShow)

    return () => {
      window.removeEventListener("pageshow", onPageShow)
      lenis.off("scroll", onLenisScroll)
      lenis.destroy()
      setLenisInstance(null)
      document.documentElement.classList.remove("lenis", "lenis-smooth")
    }
  }, [])

  return <>{children}</>
}
