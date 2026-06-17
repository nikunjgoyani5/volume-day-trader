"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useLanguage } from "@/hooks/use-language"
import { HERO_VIDEO_BY_LANGUAGE, HERO_VIDEO_POSTER } from "@/lib/hero-videos"
import HeroVisual from "./Herovisual"

export default function HeroChart() {
  const chartRef = useRef<HTMLElement | null>(null)
  const videoContainerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const userHasControlledRef = useRef(false)
  const isInViewRef = useRef(false)
  const reduceMotion = useReducedMotion()
  const { currentLanguage } = useLanguage()
  const [maxTilt, setMaxTilt] = useState(18)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [playerReady, setPlayerReady] = useState(false)
  const [showThumbnail, setShowThumbnail] = useState(true)
  const [glowShift, setGlowShift] = useState("15%")

  const videoSrc = HERO_VIDEO_BY_LANGUAGE[currentLanguage]
  const chartInView = useInView(videoContainerRef, { amount: 0.35, once: false })

  const attemptAutoPlay = useCallback(async () => {
    const video = videoRef.current
    if (
      !video ||
      userHasControlledRef.current ||
      !isInViewRef.current ||
      !video.paused
    ) {
      return
    }

    video.muted = true

    try {
      await video.play()
    } catch {
      // Video may still be buffering; media events will retry.
    }
  }, [])

  const attemptAutoPlayRef = useRef(attemptAutoPlay)
  attemptAutoPlayRef.current = attemptAutoPlay

  useEffect(() => {
    const glowQuery = window.matchMedia("(max-width: 639px)")
    const syncGlowShift = () => {
      setGlowShift(glowQuery.matches ? "28%" : "15%")
    }

    syncGlowShift()
    glowQuery.addEventListener("change", syncGlowShift)

    return () => glowQuery.removeEventListener("change", syncGlowShift)
  }, [])

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)")
    const tabletQuery = window.matchMedia("(min-width: 768px) and (max-width: 1024px)")

    const syncTilt = () => {
      if (mobileQuery.matches) {
        setMaxTilt(8)
        return
      }

      if (tabletQuery.matches) {
        setMaxTilt(12)
        return
      }

      setMaxTilt(18)
    }

    syncTilt()
    mobileQuery.addEventListener("change", syncTilt)
    tabletQuery.addEventListener("change", syncTilt)

    return () => {
      mobileQuery.removeEventListener("change", syncTilt)
      tabletQuery.removeEventListener("change", syncTilt)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: chartRef,
    offset: ["start end", "center center"],
  })

  const rotateX = useTransform(scrollYProgress, [0, 1], [maxTilt, 0])
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const visualOpacity = useTransform(scrollYProgress, [0, 0.2, 0.55], [0, 0.7, 1])

  useEffect(() => {
    isInViewRef.current = chartInView
    if (chartInView) {
      void attemptAutoPlayRef.current()
    }
  }, [chartInView])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setPlayerReady(false)
    setShowThumbnail(true)
    setIsPlaying(false)
    setIsMuted(true)
    userHasControlledRef.current = false

    video.pause()
    video.currentTime = 0
    video.muted = true
    video.playsInline = true
    video.load()

    const syncState = () => {
      setIsPlaying(!video.paused)
      setIsMuted(video.muted || video.volume === 0)
      setPlayerReady(true)
    }

    const requestAutoPlay = () => {
      void attemptAutoPlayRef.current()
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleVolumeChange = () => {
      setIsMuted(video.muted || video.volume === 0)
    }
    const markVideoLoaded = () => {
      setShowThumbnail(false)
    }
    const handleLoadedData = () => {
      syncState()
      markVideoLoaded()
      requestAutoPlay()
    }
    const handleCanPlay = () => {
      syncState()
      markVideoLoaded()
      requestAutoPlay()
    }
    const handleError = () => {
      setShowThumbnail(true)
      setPlayerReady(false)
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("volumechange", handleVolumeChange)
    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("error", handleError)

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      syncState()
      markVideoLoaded()
      requestAutoPlay()
    }

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("volumechange", handleVolumeChange)
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("error", handleError)
    }
  }, [videoSrc])

  useEffect(() => {
    if (!chartInView) return

    let attempts = 0
    const retryId = window.setInterval(() => {
      const video = videoRef.current
      if (
        !isInViewRef.current ||
        userHasControlledRef.current ||
        !video ||
        !video.paused ||
        attempts >= 20
      ) {
        window.clearInterval(retryId)
        return
      }

      attempts += 1
      void attemptAutoPlayRef.current()
    }, 500)

    return () => window.clearInterval(retryId)
  }, [chartInView, videoSrc])

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video || !playerReady) return

    userHasControlledRef.current = true

    if (video.paused) {
      void video.play()
    } else {
      video.pause()
    }
  }, [playerReady])

  const handleMuteToggle = useCallback(() => {
    const video = videoRef.current
    if (!video || !playerReady) return

    userHasControlledRef.current = true

    const nextMuted = !(video.muted || video.volume === 0)
    video.muted = nextMuted
    if (!nextMuted) {
      video.volume = 1
    }
    setIsMuted(nextMuted)
  }, [playerReady])

  const motionStyle = reduceMotion
    ? {
        rotateX: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        transformStyle: "preserve-3d" as const,
        willChange: "transform" as const,
      }
    : {
        rotateX,
        y,
        scale,
        opacity: visualOpacity,
        transformOrigin: "50% 100%",
        transformStyle: "preserve-3d" as const,
        willChange: "transform" as const,
      }

  return (
    <section
      ref={chartRef}
      className="relative z-20 mx-auto mt-8 w-full overflow-visible px-3 sm:mt-10 sm:px-4 md:mt-12 md:px-6 lg:mt-10 lg:px-4"
    >
      <div
        className="relative mx-auto max-w-[1200px] mb-4 overflow-visible"
        style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
      >
        <motion.div style={motionStyle} className="hero-aurion-stage">
          <HeroVisual />

          <div className="hero-aurion-interactive overflow-visible rounded-2xl border border-white/[0.08] bg-[#FFFFFF0D] p-3 shadow-[0_0_0_1px_rgba(120,190,255,0.06)_inset,0_24px_80px_rgba(0,0,0,0.4)] sm:rounded-3xl sm:p-4 lg:p-5">
            <div
              ref={videoContainerRef}
              className="relative mx-auto aspect-video w-full overflow-hidden rounded-2xl bg-[#050024] sm:rounded-3xl"
            >
              {showThumbnail ? (
                <Image
                  src={HERO_VIDEO_POSTER}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="pointer-events-none absolute inset-0 z-[1] rounded-2xl object-cover sm:rounded-3xl"
                />
              ) : null}
              <video
                ref={videoRef}
                src={videoSrc}
                poster={HERO_VIDEO_POSTER}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full rounded-2xl object-cover sm:rounded-3xl"
                playsInline
                preload="auto"
                aria-label={
                  currentLanguage === "pl"
                    ? "Volume Day Trader - wideo (PL)"
                    : "Volume Day Trader - video (EN)"
                }
              />
            </div>

            <div className="hero-aurion-controls bottom-3 right-3 flex items-center gap-2 sm:bottom-8 sm:right-10">
              <button
                type="button"
                onClick={handlePlayPause}
                disabled={!playerReady}
                className="relative z-50 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#151032]/90 text-white shadow-control-inset backdrop-blur-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4 fill-current sm:h-[18px] sm:w-[18px]" />
                )}
              </button>

              <button
                type="button"
                onClick={handleMuteToggle}
                disabled={!playerReady}
                className="relative z-50 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#151032]/90 text-white shadow-control-inset backdrop-blur-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                ) : (
                  <Volume2 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
        
      </div>
      
    </section>
  )
}
