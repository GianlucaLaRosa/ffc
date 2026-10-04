import type { CSSProperties } from 'react'

export const DEFAULT_PRIMARY = '#0d5c3a'
export const DEFAULT_SECONDARY = '#2ecc71'

type RGB = { r: number; g: number; b: number }

const WHITE: RGB = { r: 255, g: 255, b: 255 }
const BLACK: RGB = { r: 0, g: 0, b: 0 }
const DARK_PAGE: RGB = { r: 2, g: 6, b: 23 }
const DARK_SURFACE: RGB = { r: 15, g: 23, b: 42 }

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

export function cssHex(value: string | null | undefined, fallback = DEFAULT_PRIMARY): string {
  const rgb = parseHex(value) ?? parseHex(fallback)!
  return `#${[rgb.r, rgb.g, rgb.b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

export function parseHex(value: string | null | undefined): RGB | null {
  if (!value) return null
  const trimmed = value.trim()
  const short = /^#([0-9a-fA-F]{3})$/.exec(trimmed)
  if (short) {
    const [, hex] = short
    return {
      r: Number.parseInt(hex[0] + hex[0], 16),
      g: Number.parseInt(hex[1] + hex[1], 16),
      b: Number.parseInt(hex[2] + hex[2], 16),
    }
  }
  const full = /^#([0-9a-fA-F]{6})$/.exec(trimmed)
  if (!full) return null
  const [, hex] = full
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  }
}

function mix(a: RGB, b: RGB, amount: number): RGB {
  const t = Math.max(0, Math.min(1, amount))
  return {
    r: clampChannel(a.r + (b.r - a.r) * t),
    g: clampChannel(a.g + (b.g - a.g) * t),
    b: clampChannel(a.b + (b.b - a.b) * t),
  }
}

function channelToLinear(channel: number): number {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function relativeLuminance({ r, g, b }: RGB): number {
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b)
}

function contrastRatio(a: RGB, b: RGB): number {
  const l1 = relativeLuminance(a)
  const l2 = relativeLuminance(b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function onColor(background: RGB): RGB {
  return contrastRatio(WHITE, background) >= contrastRatio(BLACK, background) ? WHITE : { r: 15, g: 23, b: 42 }
}

function ensureContrast(foreground: RGB, background: RGB, minRatio = 4.5): RGB {
  if (contrastRatio(foreground, background) >= minRatio) return foreground
  const toward = relativeLuminance(background) > 0.45 ? BLACK : WHITE
  let low = 0
  let high = 1
  let best = mix(foreground, toward, 1)
  for (let i = 0; i < 14; i++) {
    const mid = (low + high) / 2
    const candidate = mix(foreground, toward, mid)
    if (contrastRatio(candidate, background) >= minRatio) {
      best = candidate
      high = mid
    } else {
      low = mid
    }
  }
  return best
}

function channels(rgb: RGB): string {
  return `${rgb.r} ${rgb.g} ${rgb.b}`
}

type RolePalette = {
  solid: RGB
  fg: RGB
  hover: RGB
  soft: RGB
  softFg: RGB
  border: RGB
}

function lightRole(source: RGB): RolePalette {
  const solid = source
  const fg = onColor(solid)
  const hover = mix(solid, BLACK, 0.16)
  const soft = mix(source, WHITE, 0.88)
  const softFg = ensureContrast(source, soft)
  const border = mix(source, WHITE, 0.7)
  return { solid, fg, hover, soft, softFg, border }
}

function darkRole(source: RGB, surface: RGB): RolePalette {
  const readable = ensureContrast(source, DARK_PAGE, 4.5)
  const solid = contrastRatio(source, DARK_PAGE) >= 3 ? source : mix(source, WHITE, 0.28)
  const lifted = contrastRatio(solid, DARK_PAGE) >= 2.8 ? solid : readable
  const fg = onColor(lifted)
  const hover = mix(lifted, WHITE, 0.14)
  const soft = mix(source, surface, 0.78)
  const softFg = ensureContrast(readable, soft)
  const border = mix(readable, surface, 0.55)
  return { solid: lifted, fg, hover, soft, softFg, border }
}

function roleVars(prefix: 'brand' | 'accent', light: RolePalette, dark: RolePalette): Record<string, string> {
  return {
    [`--${prefix}-light`]: channels(light.solid),
    [`--${prefix}-fg-light`]: channels(light.fg),
    [`--${prefix}-hover-light`]: channels(light.hover),
    [`--${prefix}-soft-light`]: channels(light.soft),
    [`--${prefix}-soft-fg-light`]: channels(light.softFg),
    [`--${prefix}-border-light`]: channels(light.border),
    [`--${prefix}-dark`]: channels(dark.solid),
    [`--${prefix}-fg-dark`]: channels(dark.fg),
    [`--${prefix}-hover-dark`]: channels(dark.hover),
    [`--${prefix}-soft-dark`]: channels(dark.soft),
    [`--${prefix}-soft-fg-dark`]: channels(dark.softFg),
    [`--${prefix}-border-dark`]: channels(dark.border),
  }
}

export function conferenceThemeStyle(
  primaryColor?: string | null,
  secondaryColor?: string | null,
): CSSProperties {
  const primary = parseHex(primaryColor) ?? parseHex(DEFAULT_PRIMARY)!
  const secondary = parseHex(secondaryColor) ?? parseHex(DEFAULT_SECONDARY)!

  return {
    ...roleVars('brand', lightRole(primary), darkRole(primary, DARK_SURFACE)),
    ...roleVars('accent', lightRole(secondary), darkRole(secondary, DARK_SURFACE)),
  } as CSSProperties
}
