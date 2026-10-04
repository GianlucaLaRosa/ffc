import React from 'react'
import { ConferenceTheme } from '@/components/ConferenceTheme'
import { getActiveConferenceBrand } from '@/utilities/getConferenceEdition'

export async function PolicyChrome({ children }: { children: React.ReactNode }) {
  const { primaryColor, secondaryColor } = await getActiveConferenceBrand()

  return (
    <ConferenceTheme
      className="min-h-screen flex flex-col bg-page"
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    >
      {children}
    </ConferenceTheme>
  )
}
