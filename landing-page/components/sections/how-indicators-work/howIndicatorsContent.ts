import type { StaticImageData } from "next/image";
import chartEurusd from "@/assets/images/how-indicators/chart-eurusd.png";
import chartGbpusd from "@/assets/images/how-indicators/chart-gbpusd.png";
import chartSp500 from "@/assets/images/how-indicators/chart-sp500.png";
import chartDac from "@/assets/images/how-indicators/chart-dac.png";
import chartDacSession from "@/assets/images/how-indicators/chart-dac-session.png";
import chartBitcoin from "@/assets/images/how-indicators/chart-bitcoin.png";

export type HowIndicatorsBlock =
  | { type: "headingBody"; titleKey: string; bodyKey: string }
  | { type: "image"; image: StaticImageData; altKey: string }
  | { type: "body"; bodyKey: string };

export const HOW_INDICATORS_BLOCKS: HowIndicatorsBlock[] = [
  {
    type: "headingBody",
    titleKey: "sections.platform.title",
    bodyKey: "sections.platform.body",
  },
  {
    type: "headingBody",
    titleKey: "sections.beginning.title",
    bodyKey: "sections.beginning.body",
  },
  {
    type: "headingBody",
    titleKey: "sections.whatIs.title",
    bodyKey: "sections.whatIs.body",
  },
  {
    type: "image",
    image: chartEurusd,
    altKey: "sections.eurusd.alt",
  },
  { type: "body", bodyKey: "sections.eurusd.body" },
  {
    type: "image",
    image: chartGbpusd,
    altKey: "sections.gbpusd.alt",
  },
  { type: "body", bodyKey: "sections.gbpusd.body" },
  {
    type: "image",
    image: chartSp500,
    altKey: "sections.sp500.alt",
  },
  { type: "body", bodyKey: "sections.sp500.body" },
  {
    type: "image",
    image: chartDac,
    altKey: "sections.dac.alt",
  },
  {
    type: "headingBody",
    titleKey: "sections.wwcv.title",
    bodyKey: "sections.wwcv.body",
  },
  {
    type: "image",
    image: chartDacSession,
    altKey: "sections.dacSession.alt",
  },
  { type: "body", bodyKey: "sections.bitcoin.body" },
  {
    type: "image",
    image: chartBitcoin,
    altKey: "sections.bitcoin.alt",
  },
  { type: "body", bodyKey: "sections.dq.body" },
];
