import Arrow from '@/assets/icons/Arrow.svg'
import { cn } from '@/lib/utils'

type ArrowSlideIconProps = {
  className?: string
}

export default function ArrowSlideIcon({ className }: ArrowSlideIconProps) {
  return (
    <span className={cn('arrow-slide inline-flex shrink-0', className)} aria-hidden>
      <Arrow className="arrow-slide__icon h-full w-full" />
      <Arrow className="arrow-slide__icon arrow-slide__icon--copy h-full w-full" />
    </span>
  )
}
