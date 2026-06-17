import Image from 'next/image'

import CurveGrad from '@/assets/images/gradients/curve.png'
import { cn } from '@/lib/utils'

type CurveGradientProps = {
  className?: string
}

const CurveGradient = ({ className }: CurveGradientProps) => {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 left-1/2 z-0 w-full max-w-screen-2xl -translate-x-1/2',
        className
      )}
    >
      <div className="relative mx-auto w-full px-4 sm:px-6">
        {/* Curve artwork */}
        <div className="relative mx-auto w-full max-w-6xl lg:max-w-7xl xl:max-w-screen-xl">
          <Image
            src={CurveGrad}
            alt=""
            className="curve-gradient-image relative z-0 h-auto w-full object-contain"
            priority={false}
          />

          {/* Edge fades — page bg (#050024) to hide PNG seams */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-page-bg via-page-bg/80 to-transparent sm:h-32 lg:h-40" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-page-bg via-page-bg/95 to-transparent sm:h-36 lg:h-48" />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-page-bg via-page-bg/70 to-transparent sm:w-24 lg:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-page-bg via-page-bg/70 to-transparent sm:w-24 lg:w-32" />

          {/* Soft bloom orbs — feather hard horizontal edges */}
          <div className="pointer-events-none absolute -left-1/4 top-1/3 z-10 h-40 w-1/2 rounded-full bg-page-bg opacity-90 blur-3xl sm:h-52 sm:blur-[100px]" />
          <div className="pointer-events-none absolute -right-1/4 top-1/3 z-10 h-40 w-1/2 rounded-full bg-page-bg opacity-90 blur-3xl sm:h-52 sm:blur-[100px]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-page-bg blur-2xl sm:h-28 sm:blur-3xl" />
        </div>
      </div>
    </div>
  )
}

export default CurveGradient
