import React from 'react'
import { cn } from '@/lib/utils'

export type HeadingVariant = 'section' | 'page-hero' | 'page-content'

export interface HeadingProps extends React.HTMLAttributes<HTMLElement> {
  text?: string
  children?: React.ReactNode
  as?: React.ElementType
  variant?: HeadingVariant
  align?: 'left' | 'center'
}

const variantClass: Record<HeadingVariant, string> = {
  section: 'heading-text',
  'page-hero': 'page-hero-heading',
  'page-content': 'page-content-heading',
}

const Heading = ({
  text,
  children,
  as: Tag = 'h2',
  variant = 'section',
  align,
  className = '',
  ...rest
}: HeadingProps) => {
  const defaultAlign = variant === 'section' ? 'center' : undefined
  const textAlign = align ?? defaultAlign

  return (
    <Tag
      className={cn(
        variantClass[variant],
        textAlign === 'left' && 'text-left',
        textAlign === 'center' && 'text-center',
        className
      )}
      {...rest}
    >
      {children ?? text}
    </Tag>
  )
}

export default Heading
