declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react'
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    absoluteStrokeWidth?: boolean
  }
  export type LucideIcon = FC<LucideProps>
  export const Search: LucideIcon
  export const X: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronRight: LucideIcon
  export const Play: LucideIcon
  export const Pause: LucideIcon
  export const Volume2: LucideIcon
  export const VolumeX: LucideIcon
  export const ChevronLeftIcon: LucideIcon
  export const ChevronRightIcon: LucideIcon
}
