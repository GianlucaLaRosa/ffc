/** Next data-cache tags for public conference pages. */

export const CACHE_TAGS = {
  /** Shared by every edition fetch. Bust when people/institutions (directories) change. */
  public: 'conference-public',
  archive: 'conference-archive',
  footer: 'global_footer',
  active: 'global_active-conference',
  programmeAlerts: 'global_programme-alerts',
} as const

export function conferenceIdTag(conferenceId: number | string): string {
  return `conference_id_${conferenceId}`
}

export function conferenceSlugTag(slug: string): string {
  return `conference_slug_${slug}`
}
