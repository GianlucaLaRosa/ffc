import { readFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { DEFAULT_PRIMARY, parseHex } from '@/utilities/conferenceTheme'
import { getActiveConferenceBrand, getActiveConferenceLogo } from '@/utilities/getConferenceEdition'
import { mediaUrl } from '@/utilities/conferenceUi'

export const PWA_ICON_SIZES = [192, 512] as const
export type PwaIconSize = (typeof PWA_ICON_SIZES)[number]

function isPwaIconSize(value: number): value is PwaIconSize {
  return (PWA_ICON_SIZES as readonly number[]).includes(value)
}

async function logoBuffer(requestUrl: string): Promise<Buffer> {
  const logo = await getActiveConferenceLogo()
  const url = mediaUrl(logo)
  if (url) {
    const absolute = url.startsWith('http') ? url : new URL(url, requestUrl).toString()
    try {
      const response = await fetch(absolute)
      if (response.ok) return Buffer.from(await response.arrayBuffer())
    } catch {
      // Fall through to the bundled mark.
    }
  }
  return readFile(path.join(process.cwd(), 'public/logo.png'))
}

export async function renderPwaIcon(size: number, requestUrl: string): Promise<Buffer | null> {
  if (!isPwaIconSize(size)) return null

  const { primaryColor } = await getActiveConferenceBrand()
  const background = parseHex(primaryColor) ?? parseHex(DEFAULT_PRIMARY)!
  const source = await logoBuffer(requestUrl)
  const inner = Math.round(size * 0.62)
  const mark = await sharp(source)
    .resize(inner, inner, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: background.r, g: background.g, b: background.b, alpha: 1 },
    },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toBuffer()
}
