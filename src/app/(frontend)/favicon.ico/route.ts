import { NextResponse } from 'next/server'
import { getActiveConferenceLogo } from '@/utilities/getConferenceEdition'
import { mediaUrl } from '@/utilities/conferenceUi'

export const revalidate = 60

export async function GET(request: Request) {
  const logo = await getActiveConferenceLogo()
  const url = mediaUrl(logo) || '/logo.png'
  const target = url.startsWith('http') ? url : new URL(url, request.url)
  return NextResponse.redirect(target, 307)
}
