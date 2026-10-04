import type { Conference } from '@/payload-types'

export function relationSlug(value: Conference['id'] | Conference | null | undefined): string | null {
  if (!value || typeof value !== 'object') return null
  return typeof value.slug === 'string' && value.slug ? value.slug : null
}

export function relationId(value: unknown): number | string | null {
  if (value == null) return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

/** Public path for a conference edition (active → `/`, archived → `/archive/{slug}`). */
export function conferencePublicPath({
  slug,
  publicArchive,
  activeSlug,
}: {
  slug?: string | null
  publicArchive?: boolean | null
  activeSlug?: string | null
}): string | null {
  if (!slug) return null
  if (activeSlug && slug === activeSlug) return '/'
  if (publicArchive) return `/archive/${slug}`
  return null
}
