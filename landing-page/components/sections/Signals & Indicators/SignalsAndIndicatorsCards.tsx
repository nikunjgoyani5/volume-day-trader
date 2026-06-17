"use client"

import { useRef } from "react"
import { useTranslation } from "react-i18next"

import { useMediaContentCardReveal } from "@/components/ui/motion/useMediaContentCardReveal"

interface SignalCardItem {
  title: string
  description: string
  linePath: string
}

interface SignalsAndIndicatorsCardsProps {
  items?: SignalCardItem[]
  className?: string
}

const defaultItems: SignalCardItem[] = [
  {
    title: "cards.ptaReports.title",
    description: "cards.ptaReports.desc",
    linePath: "M12 118 L68 116 L110 108 L150 74 L188 88 L228 76 L266 82 L310 64",
  },
  {
    title: "cards.wyckoffIndicators.title",
    description: "cards.wyckoffIndicators.desc",
    linePath: "M12 102 L58 86 L110 92 L152 106 L206 66 L244 80 L272 108 L310 86",
  },
  {
    title: "cards.marketAnalysis.title",
    description: "cards.marketAnalysis.desc",
    linePath: "M12 68 L46 108 L92 114 L138 98 L184 104 L232 92 L274 74 L310 78",
  },
  {
    title: "cards.tradingEducation.title",
    description: "cards.tradingEducation.desc",
    linePath: "M12 74 L58 98 L102 120 L148 96 L194 84 L240 114 L276 106 L310 80",
  },
]

const SignalsAndIndicatorsCards = ({
  items = defaultItems,
  className = "",
}: SignalsAndIndicatorsCardsProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "signals" })
  const gridRef = useRef<HTMLDivElement>(null)

  useMediaContentCardReveal(gridRef, [items.length])

  return (
    <div
      ref={gridRef}
      className={`grid grid-cols-1 gap-5 lg:grid-cols-2 ${className}`.trim()}
    >
      {items.map((item) => (
        <article
          key={item.title}
          data-signal-card=""
          className="flex flex-col gap-10 overflow-hidden rounded-2xl border border-card-border bg-card-bg px-[14px] pb-[14px] pt-10"
        >
          <div className="signal-card__media-mask overflow-hidden">
            <div data-signal-image="" className="signal-card__media">
              <img
                width={550}
                height={302}
                src="/assets/images/trade.png"
                alt={t(item.title)}
                className="mx-auto rounded-[20px]"
              />
            </div>
          </div>

          <div className="signal-card__panel-mask overflow-hidden rounded-[20px]">
            <div
              data-signal-content=""
              className="signal-card__panel flex flex-col gap-4 border-t bg-signal-panel-bg p-5"
            >
              <h3 className="card-heading text-left font-semibold leading-tight text-white">
                {t(item.title)}
              </h3>
              <p className="card-desc mt-2 text-left text-secondary-text">
                {t(item.description)}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default SignalsAndIndicatorsCards
