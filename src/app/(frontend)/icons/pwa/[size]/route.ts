import { NextResponse } from 'next/server'
import { renderPwaIcon } from '@/utilities/pwaIcons'

export const revalidate = 60
export const runtime = 'nodejs'

type RouteProps = {
  params: Promise<{ size: string }>
}

export async function GET(request: Request, { params }: RouteProps) {
  const { size: rawSize } = await params
  const size = Number.parseInt(rawSize, 10)
  const icon = await renderPwaIcon(size, request.url)
  if (!icon) {
    return new NextResponse('Not found', { status: 404 })
  }

  return new NextResponse(Uint8Array.from(icon), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
