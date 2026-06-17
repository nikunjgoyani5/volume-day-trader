"use client"

import { cn } from "@/lib/utils"
import FlowTextLabel, { type FlowTextLabelProps } from "@/components/ui/flow-text/FlowTextLabel"
import {
  CTA_FLOW_LABEL_COLOR,
  CTA_FLOW_TEXT_LEAVE_DELAY_MS,
} from "@/lib/motion/flow-text-motion"

type CtaFlowLabelProps = Omit<FlowTextLabelProps, "leaveBaseDelayMs"> & {
  /** Defaults to white; pass a matching color for non-button links (e.g. blog Learn More) */
  shadowColor?: string
}

export default function CtaFlowLabel({
  className,
  style,
  shadowColor = CTA_FLOW_LABEL_COLOR,
  ...props
}: CtaFlowLabelProps) {
  const labelColor =
    typeof style?.color === "string" ? style.color : CTA_FLOW_LABEL_COLOR

  return (
    <FlowTextLabel
      {...props}
      shadowColor={shadowColor}
      leaveBaseDelayMs={CTA_FLOW_TEXT_LEAVE_DELAY_MS}
      className={cn(
        labelColor === CTA_FLOW_LABEL_COLOR ? "text-white" : undefined,
        className
      )}
      style={{ color: labelColor, ...style }}
    />
  )
}
