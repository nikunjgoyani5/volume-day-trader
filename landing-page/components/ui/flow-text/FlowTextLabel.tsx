"use client"

import { cn } from "@/lib/utils"
import {
  NAV_FLOW_HOVER_STEP_MS,
  NAV_FLOW_LEAVE_STEP_MS,
  NAV_FLOW_LETTER_DURATION_MS,
  NAV_FLOW_LETTER_EASE,
  NAV_FLOW_SHIFT,
} from "@/lib/motion/flow-text-motion"

export type FlowTextLabelProps = {
  label: string
  hovered: boolean
  className?: string
  style?: React.CSSProperties
  /** Duplicate letter color via text-shadow (NavLink default) */
  shadowColor?: string
  /** Extra delay before letters return on hover out (CTA: after arrow resets) */
  leaveBaseDelayMs?: number
}

export default function FlowTextLabel({
  label,
  hovered,
  className,
  style,
  shadowColor = "#ED1F24",
  leaveBaseDelayMs = 0,
}: FlowTextLabelProps) {
  const letters = label.split("")
  const shift = NAV_FLOW_SHIFT

  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={style}
    >
      <span className="sr-only">{label}</span>
      <div
        aria-hidden
        className="flow-text__clip"
        style={{ overflow: "hidden", lineHeight: 1.08, height: "1.08em" }}
      >
        <div
          className="flow-text__letters"
          style={{
            textShadow: `0 ${shift} 0 ${shadowColor}`,
            lineHeight: 1.08,
            color: style?.color ?? "inherit",
          }}
        >
          {letters.map((char, i) => (
            <span
              key={`${char}-${i}`}
              style={{
                position: "relative",
                display: "inline-block",
                lineHeight: 1.08,
                color: "inherit",
                transform: hovered
                  ? `translate3d(0px, -${shift}, 0px)`
                  : "translate3d(0px, 0px, 0px)",
                transitionProperty: "transform",
                transitionDuration: `${NAV_FLOW_LETTER_DURATION_MS}ms`,
                transitionTimingFunction: NAV_FLOW_LETTER_EASE,
                transitionDelay: hovered
                  ? `${i * NAV_FLOW_HOVER_STEP_MS}ms`
                  : `${leaveBaseDelayMs + (letters.length - 1 - i) * NAV_FLOW_LEAVE_STEP_MS}ms`,
                willChange: "transform",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>
    </span>
  )
}
