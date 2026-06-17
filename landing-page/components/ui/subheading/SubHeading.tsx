import React from 'react'
import { cn } from '@/lib/utils'

export type SubHeadingVariant = 'section' | 'page-hero' | 'page-content'

export interface SubHeadingProps extends React.HTMLAttributes<HTMLElement> {
  text?: string
  children?: React.ReactNode
  as?: React.ElementType
  variant?: SubHeadingVariant
  align?: 'left' | 'center'
}

const variantClass: Record<SubHeadingVariant, string> = {
  section: 'subheading-text',
  'page-hero': 'page-hero-subheading',
  'page-content': 'page-content-desc',
}

const SubHeading = ({
  text,
  children,
  as: Tag = 'p',
  variant = 'section',
  align,
  className = '',
  ...rest
}: SubHeadingProps) => {
  const defaultAlign = variant === 'section' ? 'center' : undefined
  const textAlign = align ?? defaultAlign

  return (
    <Tag
      className={cn(
        variantClass[variant],
        variant === 'page-content' && 'whitespace-pre-line line-clamp-none',
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

export default SubHeading
