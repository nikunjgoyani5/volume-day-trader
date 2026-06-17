"use client"

import { useState, type ComponentProps } from "react"
import { cn } from "@/lib/utils"
import VectorArrow from "@/components/ui/vector-arrow/VectorArrow"
import { getCtaArrowDelayMs } from "@/lib/motion/flow-text-motion"
import CtaFlowLabel from "./CtaFlowLabel"

export type CtaFlowButtonProps = ComponentProps<"button"> & {
  label: string
  arrowClassName?: string
}

export default function CtaFlowButton({
  label,
  className,
  arrowClassName,
  onMouseEnter,
  onMouseLeave,
  style,
  type = "button",
  ...props
}: CtaFlowButtonProps) {
  const [hovered, setHovered] = useState(false)
  const arrowDelayMs = getCtaArrowDelayMs(label.length)

  return (
    <button
      type={type}
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
      <CtaFlowLabel label={label} hovered={hovered} />
      <VectorArrow className={arrowClassName} />
    </button>
  )
}
