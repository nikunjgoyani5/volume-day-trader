"use client";

import { useTranslation } from "react-i18next";

const logos = [
  {
    name: "WunderTrading",
    render: () => (
      <div className="flex items-center gap-2 sm:gap-3 group">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[34px] md:h-[34px] lg:w-[38px] lg:h-[38px] text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0"
        >
          <rect x="2" y="2" width="9" height="9" rx="1.5" fill="currentColor" />
          <rect x="13" y="2" width="9" height="9" rx="1.5" fill="currentColor" />
          <rect x="2" y="13" width="9" height="9" rx="1.5" fill="currentColor" />
          <rect x="13" y="13" width="9" height="9" rx="1.5" fill="currentColor" />
        </svg>

        <span className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-medium text-white/40 group-hover:text-white/60 tracking-tight font-hoves transition-colors whitespace-nowrap">
          WunderTrading
        </span>
      </div>
    ),
  },

  {
    name: "Binance",
    render: () => (
      <div className="flex items-center gap-2 sm:gap-3 group">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[34px] md:h-[34px] lg:w-[38px] lg:h-[38px] text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0"
        >
          <path d="M12 3L14.5 5.5L9 11L6.5 8.5L12 3Z" fill="currentColor" />
          <path d="M16 7L18.5 9.5L9 19L6.5 16.5L16 7Z" fill="currentColor" />
          <path d="M5 10.5L7.5 13L5 15.5L2.5 13L5 10.5Z" fill="currentColor" />
          <path d="M19 10.5L21.5 13L19 15.5L16.5 13L19 10.5Z" fill="currentColor" />
          <path d="M12 16.5L14.5 19L12 21.5L9.5 19L12 16.5Z" fill="currentColor" />
        </svg>

        <span className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-bold text-white/40 group-hover:text-white/60 tracking-wider uppercase font-hoves transition-colors whitespace-nowrap">
          BINANCE
        </span>
      </div>
    ),
  },

  {
    name: "TradersPost",
    render: () => (
      <div className="flex items-center gap-2 sm:gap-3 group">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[34px] md:h-[34px] lg:w-[38px] lg:h-[38px] text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0"
        >
          <path
            d="M3 17L9 11L13 15L21 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M17 7H21V11"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-semibold text-white/40 group-hover:text-white/60 tracking-tight font-hoves transition-colors whitespace-nowrap">
          TradersPost
        </span>
      </div>
    ),
  },

  {
    name: "Cboe",
    render: () => (
      <div className="flex items-center gap-0.5 sm:gap-1 group">
        <span className="text-[15px] sm:text-[18px] md:text-[21px] lg:text-[24px] font-semibold text-white/40 group-hover:text-white/60 tracking-wide font-hoves transition-colors">
          C
        </span>

        <span className="text-[10px] sm:text-[11px] md:text-[13px] font-normal text-white/40 group-hover:text-white/60 relative top-[-3px] sm:top-[-4px] transition-colors">
          ✦
        </span>

        <span className="text-[15px] sm:text-[18px] md:text-[21px] lg:text-[24px] font-semibold text-white/40 group-hover:text-white/60 tracking-wide font-hoves transition-colors">
          boe
        </span>
      </div>
    ),
  },

  {
    name: "OpenAI",
    render: () => (
      <div className="flex items-center gap-2 sm:gap-3 group">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[34px] md:h-[34px] lg:w-[38px] lg:h-[38px] text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0"
        >
          <path
            d="M20.5 11.5C20.5 16.75 16.25 21 11 21C5.75 21 1.5 16.75 1.5 11.5C1.5 6.25 5.75 2 11 2C13.5 2 15.75 2.95 17.45 4.55"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <circle
            cx="11"
            cy="11.5"
            r="3.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>

        <span className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-medium text-white/40 group-hover:text-white/60 tracking-tight font-hoves transition-colors whitespace-nowrap">
          OpenAI
        </span>
      </div>
    ),
  },

  {
    name: "TradingView",
    render: () => (
      <div className="flex items-center gap-2 sm:gap-3 group">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[34px] md:h-[34px] lg:w-[38px] lg:h-[38px] text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0"
        >
          <path
            d="M2 18L8 12L12 16L22 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-semibold text-white/40 group-hover:text-white/60 tracking-tight font-hoves transition-colors whitespace-nowrap">
          TradingView
        </span>
      </div>
    ),
  },

  {
    name: "Barchart",
    render: () => (
      <div className="flex items-center gap-2 sm:gap-3 group">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[34px] md:h-[34px] lg:w-[38px] lg:h-[38px] text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0"
        >
          <rect x="2" y="14" width="4" height="8" rx="1" fill="currentColor" />
          <rect x="8" y="9" width="4" height="13" rx="1" fill="currentColor" />
          <rect x="14" y="5" width="4" height="17" rx="1" fill="currentColor" />
          <rect x="20" y="2" width="4" height="20" rx="1" fill="currentColor" />
        </svg>

        <span className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-medium text-white/40 group-hover:text-white/60 tracking-tight font-hoves transition-colors whitespace-nowrap">
          Barchart
        </span>
      </div>
    ),
  },
];

const loopLogos = [...logos, ...logos];

export default function TrustedLogos() {
  const { t } = useTranslation();

  const LogoTrack = ({ className }: { className?: string }) => (
    <div
      className={`flex items-center gap-10 sm:gap-12 md:gap-14 lg:gap-15 xl:gap-17 whitespace-nowrap animate-marquee will-change-transform ${className}`}
      style={{ width: "max-content" }}
    >
      {loopLogos.map((logo, i) => (
        <div
          key={i}
          className="flex-shrink-0 flex items-center pointer-events-none select-none"
        >
          {logo.render()}
        </div>
      ))}
    </div>
  );

  return (
    <section className="w-full bg-transparent mt-8 relative overflow-hidden">
      <p className="text-center text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] tracking-[0.05em] uppercase text-white/80 font-hoves px-4">
        {/* {t("hero.integration")} */}
        Integrated with top exchanges
      </p>

      <div className="relative mt-4 sm:mt-5">
        <div className="flex h-10 items-center overflow-hidden sm:h-12 md:h-16 lg:h-20">
          <LogoTrack />
        </div>

        <div
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-page-bg to-transparent sm:w-32 md:w-40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-page-bg to-transparent sm:w-32 md:w-40"
          aria-hidden
        />
      </div>
    </section>
  );
}
