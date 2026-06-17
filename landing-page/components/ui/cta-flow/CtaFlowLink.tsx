"use client"

import Link from "next/link"
import { useState, type ComponentProps } from "react"
import { cn } from "@/lib/utils"
import VectorArrow from "@/components/ui/vector-arrow/VectorArrow"
import { getCtaArrowDelayMs } from "@/lib/motion/flow-text-motion"
import CtaFlowLabel from "./CtaFlowLabel"

export type CtaFlowLinkProps = ComponentProps<typeof Link> & {
  label: string
  arrowClassName?: string
  leadingIcon?: boolean
}

export default function CtaFlowLink({
  label,
  className,
  arrowClassName,
  leadingIcon = false,
  onMouseEnter,
  onMouseLeave,
  style,
  ...props
}: CtaFlowLinkProps) {
  const [hovered, setHovered] = useState(false)
  const arrowDelayMs = getCtaArrowDelayMs(label.length)

  return (
    <Link
      className={cn("cta-flow text-white", className)}
      style={{
        ...style,
        ["--cta-arrow-delay" as string]: `${arrowDelayMs}ms`,
      }}
      onMouseEnter={(event) => {
        setHovered(true)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        setHovered(false)
        onMouseLeave?.(event)
      }}
      {...props}
    >
      {leadingIcon ? <VectorArrow className={arrowClassName} flipped /> : null}
      <CtaFlowLabel label={label} hovered={hovered} />
      {!leadingIcon ? <VectorArrow className={arrowClassName} /> : null}
    </Link>
  )
}
