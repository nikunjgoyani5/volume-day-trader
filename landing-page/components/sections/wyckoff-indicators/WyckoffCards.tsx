"use client"

import Image, { StaticImageData } from "next/image"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

import Wyckoff1 from "@/assets/images/wyckoff/wyckoff-1.png"
import Wyckoff2 from "@/assets/images/wyckoff/wyckoff-2.png"
import Wyckoff3 from "@/assets/images/wyckoff/wyckoff-3.png"
import Wyckoff4 from "@/assets/images/wyckoff/wyckoff-4.png"
import { useMediaContentCardReveal } from "@/components/ui/motion/useMediaContentCardReveal"

interface WyckoffCardItem {
  key: "demandSupply" | "buyerSellerPressure" | "momentumShift" | "marketReading"
  title: string
  description: string
  image: StaticImageData
}

interface WyckoffCardsProps {
  items?: WyckoffCardItem[]
  className?: string
}

const defaultItems: WyckoffCardItem[] = [
  {
    key: "demandSupply",
    title: "Demand & Supply Analysis",
    description:
      "The indicator highlights potential demand and supply behavior to help traders understand market pressure and possible trend continuation or weakness.",
    image: Wyckoff1,
  },
  {
    key: "buyerSellerPressure",
    title: "Buyer & Seller Pressure",
    description:
      "Visual volume analysis helps identify areas where buyers or sellers may be taking control of the market.",
    image: Wyckoff2,
  },
  {
    key: "momentumShift",
    title: "Momentum Shift Detection",
    description:
      "Recognize possible momentum transitions and market reactions through structured volume interpretation.",
    image: Wyckoff3,
  },
  {
    key: "marketReading",
    title: "Structured Market Reading",
    description:
      "Designed to simplify chart analysis and help traders follow a more disciplined and organized trading workflow.",
    image: Wyckoff4,
  },
]

const WyckoffCards = ({
  items = defaultItems,
  className = "",
}: WyckoffCardsProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "wyckoffIndicators.cards" })
  const gridRef = useRef<HTMLDivElement>(null)

  useMediaContentCardReveal(gridRef, [items.length])

  return (
    <div
      ref={gridRef}
      className={`grid grid-cols-1 gap-5 lg:grid-cols-2 ${className}`.trim()}
    >
      {items.map((item) => (
        <article
          key={item.key}
          data-signal-card=""
          className="flex flex-col gap-10 overflow-hidden rounded-2xl border border-[#1D1938] bg-[#0D082B] px-[14px] pb-[14px] pt-10"
        >
          <div className="signal-card__media-mask overflow-hidden">
            <div data-signal-image="" className="signal-card__media">
              <Image
                src={item.image}
                alt={t(`${item.key}.title`)}
                width={550}
                height={302}
                className="mx-auto rounded-[20px]"
              />
            </div>
          </div>

          <div className="signal-card__panel-mask overflow-hidden rounded-[20px]">
            <div
              data-signal-content=""
              className="signal-card__panel flex flex-col gap-4 border-t bg-[#151032] p-5"
            >
              <h3 className="card-heading text-left font-semibold leading-tight">
                {t(`${item.key}.title`)}
              </h3>
              <p className="card-desc mt-2 text-left text-[#A7ADBE]">
                {t(`${item.key}.desc`)}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default WyckoffCards
