const LOGO_SRC = "/assets/images/volumedaytrader-logo.png";

type VdltraLogoProps = {
  className?: string;
  showWordmark?: boolean;
  /** Fits the wide logo inside the dashboard sidebar */
  compact?: boolean;
};

export default function VdltraLogo({
  className = "",
  showWordmark = true,
  compact = false,
}: VdltraLogoProps) {
  if (!showWordmark) return null;

  return (
    <img
      src={LOGO_SRC}
      alt="VolumeDayTrader.com - Stay on the right side of the market"
      className={`block h-auto w-full p-0.5 object-contain object-left ${className} ${
        compact
          ? "max-h-11"
          : "max-h-12 max-w-[min(100%,20rem)] sm:max-h-14 sm:max-w-[22rem] md:max-h-16 md:max-w-[26rem]"
      }`}
    />
  );
}
