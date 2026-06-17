"use client"

import { useInView, useReducedMotion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type ParsedStat = {
  prefix: string
  end: number
  suffix: string
  decimals: number
  useCommas: boolean
}

function parseStatValue(value: string): ParsedStat | null {
  const match = value.trim().match(/^([^0-9.-]*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!match) return null

  const [, prefix = "", numStr, suffix = ""] = match
  const normalized = numStr.replace(/,/g, "")
  const end = Number(normalized)
  if (Number.isNaN(end)) return null

  const decimals = (normalized.split(".")[1] ?? "").length

  return {
    prefix,
    end,
    suffix,
    decimals,
    useCommas: numStr.includes(","),
  }
}

function formatStatNumber(value: number, decimals: number, useCommas: boolean) {
  const fixed = value.toFixed(decimals)
  if (!useCommas) return fixed

  const [intPart, decPart] = fixed.split(".")
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return decPart ? `${withCommas}.${decPart}` : withCommas
}

type CountUpValueProps = {
  value: string
  className?: string
  durationMs?: number
}

export default function CountUpValue({
  value,
  className,
  durationMs = 2000,
}: CountUpValueProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })
  const prefersReducedMotion = useReducedMotion()
  const parsed = useMemo(() => parseStatValue(value), [value])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!parsed || !inView) return

    if (prefersReducedMotion) {
      setCurrent(parsed.end)
      return
    }

    const start = performance.now()
    let frameId = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - (1 - progress) ** 3
      setCurrent(parsed.end * eased)

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        setCurrent(parsed.end)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [durationMs, inView, parsed, prefersReducedMotion])

  if (!parsed) {
    return (
      <p ref={ref} className={cn(className)}>
        {value}
      </p>
    )
  }

  const display =
    inView || prefersReducedMotion
      ? formatStatNumber(current, parsed.decimals, parsed.useCommas)
      : formatStatNumber(0, parsed.decimals, parsed.useCommas)

  return (
    <p ref={ref} className={cn(className)}>
      {parsed.prefix}
      {display}
      {parsed.suffix}
    </p>
  )
}
