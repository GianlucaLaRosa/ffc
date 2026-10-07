import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload } from 'payload'

import { CONVENTION_2025_PARTNERS } from '@/seed/data/convention2025'
import {
  FOOTER_CREDITS_SEED,
  FOOTER_DELEGATION_SEED,
  FOOTER_STRUCTURE_SEED,
} from '@/seed/data/footer'
import { seedPartnerLogos } from '@/seed/helpers'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const PARTNERS_DIR = path.resolve(dirname, '../seed/assets/convention2025/partners')

const SEED_CONTEXT = { disableRevalidate: true } as const

const withIconProvider = (
  group: {
    icon?: { provider?: string | null; name?: string | null } | null
    label?: string | null
    url?: string | null
  } | null | undefined,
) => ({
  icon: {
    provider: group?.icon?.provider || 'lucide',
    name: group?.icon?.name ?? null,
  },
  label: group?.label ?? null,
  url: group?.url ?? null,
})

const orgLinkEmpty = (group: { label?: string | null; url?: string | null } | null | undefined) =>
  !group?.label?.trim() && !group?.url?.trim()

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
  const canSeedPartnerFiles =
    !process.env.VERCEL || Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  const seedPartners =
    canSeedPartnerFiles &&
    (!Array.isArray(footer.partners) || footer.partners.length === 0)
  const seedCredits = !Array.isArray(footer.credits) || footer.credits.length === 0

  if (!seedStructure && !seedDelegation && !seedPartners && !seedCredits) return

  try {
    if (seedPartners) {
      payload.logger.info(
        `Seeding ${CONVENTION_2025_PARTNERS.length} footer partner logo(s) for Convention 2025…`,
      )
    }

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
          ? await seedPartnerLogos({
              payload,
              partners: CONVENTION_2025_PARTNERS,
              assetsDir: PARTNERS_DIR,
            })
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
