import type { NextRequest } from 'next/server'

import { serveMediaBlobFile, serveMediaBlobHead } from '@/utilities/serveMediaBlob'

type RouteContext = { params: Promise<{ filename: string }> }

export async function GET(req: NextRequest, context: RouteContext): Promise<Response> {
  const { filename } = await context.params
  const prefix = req.nextUrl.searchParams.get('prefix')
  return serveMediaBlobFile(filename, prefix, req.headers.get('if-none-match') ?? undefined)
}

export async function HEAD(req: NextRequest, context: RouteContext): Promise<Response> {
  const { filename } = await context.params
  const prefix = req.nextUrl.searchParams.get('prefix')
  return serveMediaBlobHead(filename, prefix)
}
