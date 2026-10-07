import type { Institution } from '@/payload-types'

export const ITALY_COUNTRY_NAME = 'Italy'

export type InstitutionRegionGroup = {
  regionName: string | null
  institutions: Institution[]
}

export type InstitutionCountryGroup = {
  countryName: string
  isItaly: boolean
  regions: InstitutionRegionGroup[]
}

const compareLabel = (a: string, b: string, locale: string) =>
  a.localeCompare(b, locale, { sensitivity: 'base' })

const compareInstitutionName = (a: Institution, b: Institution) =>
  compareLabel(a.name, b.name, 'en')

function countryNameOf(institution: Institution): string {
  return typeof institution.country === 'object' && institution.country
    ? institution.country.name
    : ''
}

function regionNameOf(institution: Institution): string | null {
  return typeof institution.region === 'object' && institution.region
    ? institution.region.name
    : null
}

function groupByRegion(institutions: Institution[]): InstitutionRegionGroup[] {
  const byRegion = new Map<string, Institution[]>()
  const withoutRegion: Institution[] = []

  for (const institution of institutions) {
    const regionName = regionNameOf(institution)
    if (!regionName) {
      withoutRegion.push(institution)
      continue
    }
    const list = byRegion.get(regionName) ?? []
    list.push(institution)
    byRegion.set(regionName, list)
  }

  const regions: InstitutionRegionGroup[] = [...byRegion.entries()]
    .sort(([a], [b]) => compareLabel(a, b, 'it'))
    .map(([regionName, docs]) => ({
      regionName,
      institutions: [...docs].sort(compareInstitutionName),
    }))

  if (withoutRegion.length > 0) {
    regions.push({
      regionName: null,
      institutions: withoutRegion.sort(compareInstitutionName),
    })
  }

  return regions
}

/**
 * Public institution list: Italy first (regions A–Z), then other countries A–Z.
 * Institutions inside a group are sorted by name.
 */
export function groupInstitutionsForDisplay(
  institutions: Institution[],
): InstitutionCountryGroup[] {
  const italy: Institution[] = []
  const byOtherCountry = new Map<string, Institution[]>()

  for (const institution of institutions) {
    const countryName = countryNameOf(institution)
    if (countryName === ITALY_COUNTRY_NAME) {
      italy.push(institution)
      continue
    }
    const key = countryName || '\uFFFF'
    const list = byOtherCountry.get(key) ?? []
    list.push(institution)
    byOtherCountry.set(key, list)
  }

  const groups: InstitutionCountryGroup[] = []

  if (italy.length > 0) {
    groups.push({
      countryName: ITALY_COUNTRY_NAME,
      isItaly: true,
      regions: groupByRegion(italy),
    })
  }

  const otherCountries = [...byOtherCountry.entries()].sort(([a], [b]) =>
    compareLabel(a, b, 'en'),
  )

  for (const [key, docs] of otherCountries) {
    groups.push({
      countryName: key === '\uFFFF' ? '' : key,
      isItaly: false,
      regions: [
        {
          regionName: null,
          institutions: [...docs].sort(compareInstitutionName),
        },
      ],
    })
  }

  return groups
}
