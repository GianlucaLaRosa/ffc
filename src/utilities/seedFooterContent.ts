import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload } from 'payload'

import {
  FOOTER_CREDITS_SEED,
  FOOTER_DELEGATION_SEED,
  FOOTER_PARTNERS_SEED,
  FOOTER_STRUCTURE_SEED,
} from '@/seed/data/footer'
import { PARTNER_LOGOS_FOLDER_NAME, ensureMediaFolder } from '@/utilities/mediaFolder'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const PARTNERS_DIR = path.resolve(dirname, '../seed/assets/convention2025/partners')

const SEED_CONTEXT = { disableRevalidate: true } as const

const withIconProvider = (group: {
  icon?: { provider?: string | null; name?: string | null } | null
  label?: string | null
  url?: string | null
}) => ({
  icon: {
    provider: group.icon?.provider || 'lucide',
    name: group.icon?.name ?? null,
  },
  label: group.label ?? null,
  url: group.url ?? null,
})

const orgLinkEmpty = (group: { label?: string | null; url?: string | null } | null | undefined) =>
  !group?.label?.trim() && !group?.url?.trim()

async function seedPartnerRows(payload: Payload) {
  const folderId = await ensureMediaFolder({
    folderName: PARTNER_LOGOS_FOLDER_NAME,
    payload,
  })

  const partners = []

  for (const partner of FOOTER_PARTNERS_SEED) {
    const { docs } = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      pagination: false,
      where: { filename: { equals: partner.file } },
    })

    let imageId = docs[0]?.id

    if (imageId == null) {
      const created = await payload.create({
        collection: 'media',
        depth: 0,
        overrideAccess: true,
        context: SEED_CONTEXT,
        data: {
          alt: partner.mediaAlt,
          folder: folderId,
        },
        filePath: path.join(PARTNERS_DIR, partner.file),
      })
      imageId = created.id
    }

    partners.push({
      image: imageId,
      url: partner.url,
      alt: partner.alt,
    })
  }

  return partners
}

/**
 * Fills Footer links, partners, and credits from the 23rd convention brochure when empty.
 */
export async function seedFooterContent({ payload }: { payload: Payload }): Promise<void> {
  let footer: {
    structure?: { label?: string | null; url?: string | null; icon?: { provider?: string | null; name?: string | null } | null } | null
    delegation?: { label?: string | null; url?: string | null; icon?: { provider?: string | null; name?: string | null } | null } | null
    partners?: unknown
    credits?: unknown
  }

  try {
    footer = await payload.findGlobal({
      slug: 'footer',
      depth: 0,
    })
  } catch (err) {
    payload.logger.error({ err, msg: 'Failed to read footer before seeding content' })
    return
  }

  const seedStructure = orgLinkEmpty(footer.structure)
  const seedDelegation = orgLinkEmpty(footer.delegation)
  const seedPartners = !Array.isArray(footer.partners) || footer.partners.length === 0
  const seedCredits = !Array.isArray(footer.credits) || footer.credits.length === 0

  if (!seedStructure && !seedDelegation && !seedPartners && !seedCredits) return

  try {
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        structure: seedStructure
          ? withIconProvider(FOOTER_STRUCTURE_SEED)
          : withIconProvider(footer.structure),
        delegation: seedDelegation
          ? withIconProvider(FOOTER_DELEGATION_SEED)
          : withIconProvider(footer.delegation),
        partners: seedPartners
          ? await seedPartnerRows(payload)
          : Array.isArray(footer.partners)
            ? footer.partners
            : [],
        credits: seedCredits
          ? FOOTER_CREDITS_SEED.map((row) => ({ role: row.role, name: row.name }))
          : Array.isArray(footer.credits)
            ? footer.credits
            : [],
      },
      context: SEED_CONTEXT,
    })
    payload.logger.info('Footer links, partners, and credits seeded.')
  } catch (err) {
    payload.logger.error({ err, msg: 'Failed to seed footer links, partners, and credits' })
  }
}
