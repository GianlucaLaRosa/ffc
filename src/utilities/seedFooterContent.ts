import type { Payload } from 'payload'

import {
  FOOTER_CREDITS_SEED,
  FOOTER_DELEGATION_SEED,
  FOOTER_STRUCTURE_SEED,
} from '@/seed/data/footer'

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

/** Fills Footer structure, delegation, and credits when empty. Partner logos seed via `pnpm seed` only. */
export async function seedFooterContent({ payload }: { payload: Payload }): Promise<void> {
  let footer: {
    structure?: { label?: string | null; url?: string | null; icon?: { provider?: string | null; name?: string | null } | null } | null
    delegation?: { label?: string | null; url?: string | null; icon?: { provider?: string | null; name?: string | null } | null } | null
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
  const seedCredits = !Array.isArray(footer.credits) || footer.credits.length === 0

  if (!seedStructure && !seedDelegation && !seedCredits) return

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
        credits: seedCredits
          ? FOOTER_CREDITS_SEED.map((row) => ({ role: row.role, name: row.name }))
          : Array.isArray(footer.credits)
            ? footer.credits
            : [],
      },
      context: SEED_CONTEXT,
    })
    payload.logger.info('Footer links and credits seeded.')
  } catch (err) {
    payload.logger.error({ err, msg: 'Failed to seed footer links and credits' })
  }
}
