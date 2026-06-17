import React from 'react'
import { Particles } from '@/components/ui/particles'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
  showArrows?: boolean
  leftArrowSrc?: string
  rightArrowSrc?: string
  backgroundImageSrc?: string
}

const Badge = ({
  text = 'Badge',
  showArrows = true,
  leftArrowSrc = '/assets/images/badge/badge_arrow-left.svg',
  rightArrowSrc = '/assets/images/badge/badge_arrow-right.svg',
  backgroundImageSrc = '/assets/images/badge/badge_bg.png',
  className = '',
  ...rest
}: BadgeProps) => {
  const pillClasses = 'badge-pill'

  const arrowClasses =
    'relative z-10 h-3 w-[clamp(36px,11vw,88px)] shrink object-contain object-center sm:h-[18px] sm:w-[108px] md:h-5 md:w-[128px]'

  return (
    <div
      className={cn(
        'relative mx-auto w-full min-w-0 max-w-[717px] overflow-visible',
        className
      )}
      {...rest}
    >
      {/* Aspect box sizes the arc graphic; content is overlaid so flex never squashes it */}
      <div className="relative aspect-[717/268] w-full overflow-visible">
        {backgroundImageSrc ? (
          <img
            src={backgroundImageSrc}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain object-center"
            draggable={false}
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 z-[1] overflow-visible">
          <Particles quantity={40} size={0.5} color="#ffffff" className="h-full w-full opacity-60" />
        </div>

        <div className="absolute inset-0 z-10 flex min-w-0 items-center justify-center gap-1 overflow-visible px-0.5 sm:gap-3 sm:px-2 md:gap-5">
          {showArrows ? (
            <img
              src={leftArrowSrc}
              alt=""
              aria-hidden="true"
              className={arrowClasses}
            />
          ) : null}

          <div className="glass-surface badge-element relative z-10 shrink-0">
            <span className="badge-text">{text}</span>
          </div>

          {showArrows ? (
            <img
              src={rightArrowSrc}
              alt=""
              aria-hidden="true"
              className={arrowClasses}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Badge
