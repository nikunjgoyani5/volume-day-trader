/** Navbar NavLink + CTA label flow (vertical letter cascade) */
export const NAV_FLOW_SHIFT = "1.08em"
export const NAV_FLOW_LETTER_DURATION_MS = 1000
export const NAV_FLOW_HOVER_STEP_MS = 42
export const NAV_FLOW_LEAVE_STEP_MS = 30
export const NAV_FLOW_LETTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"

/** CTA arrow waits for label cascade to finish, then existing arrow CSS runs */
export const CTA_FLOW_TEXT_LEAVE_DELAY_MS = 300

/** CTA label + text-shadow duplicate — always white, never nav red */
export const CTA_FLOW_LABEL_COLOR = "#ffffff"

/** Brief pause after stagger before arrow starts */
export const CTA_FLOW_ARROW_LEAD_IN_MS = 120

/** Stagger step for arrow delay only (faster than nav label cascade) */
export const CTA_FLOW_ARROW_STAGGER_STEP_MS = 24

/** When the last letter finishes its hover-in transition (nav timing reference) */
export function getNavFlowCompleteMs(letterCount: number) {
  if (letterCount <= 1) return NAV_FLOW_LETTER_DURATION_MS
  return (
    (letterCount - 1) * NAV_FLOW_HOVER_STEP_MS + NAV_FLOW_LETTER_DURATION_MS
  )
}

/** CTA arrow delay — starts soon after stagger, not after full 1s letter slide */
export function getCtaArrowDelayMs(letterCount: number) {
  if (letterCount <= 1) return CTA_FLOW_ARROW_LEAD_IN_MS
  return (
    (letterCount - 1) * CTA_FLOW_ARROW_STAGGER_STEP_MS +
    CTA_FLOW_ARROW_LEAD_IN_MS
  )
}
