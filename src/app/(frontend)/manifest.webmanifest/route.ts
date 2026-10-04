import { conferenceWebManifest } from '@/utilities/conferenceWebManifest'

export const revalidate = 60

export async function GET() {
  const manifest = await conferenceWebManifest()
  return Response.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
