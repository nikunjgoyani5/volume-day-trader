import Vector from '@/assets/icons/Vector.svg'
import { cn } from '@/lib/utils'

export type VectorArrowProps = {
  className?: string
  /** Rotate 180° for back / left-pointing arrows */
  flipped?: boolean
}

export default function VectorArrow({ className, flipped = false }: VectorArrowProps) {
  return (
    <span
      className={cn(
        'vector-arrow inline-flex shrink-0',
        flipped && 'rotate-180',
        className
      )}
      aria-hidden
    >
      <Vector className="vector-arrow__svg " />
      <Vector className="vector-arrow__svg vector-arrow__svg--copy" />
    </span>
  )
}
