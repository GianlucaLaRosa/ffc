import React from 'react'
import { conferenceThemeStyle } from '@/utilities/conferenceTheme'
import { cn } from '@/utilities/ui'

export function ConferenceTheme({
  primaryColor,
  secondaryColor,
  className,
  children,
}: {
  primaryColor?: string | null
  secondaryColor?: string | null
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('theme', className)} style={conferenceThemeStyle(primaryColor, secondaryColor)}>
      {children}
    </div>
  )
}
