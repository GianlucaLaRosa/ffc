import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload } from 'payload'

import { CONVENTION_2025_PARTNERS } from '@/seed/data/convention2025'
import { seedPartnerLogos } from '@/seed/helpers'

const SEED_CONTEXT = { disableRevalidate: true } as const

const dirname = path.dirname(fileURLToPath(import.meta.url))
const PARTNERS_DIR = path.resolve(dirname, 'assets/convention2025/partners')

/** Seeds footer partner logos from brochure assets. CLI seed only — not imported from payload.config. */
export async function seedFooterPartners({ payload }: { payload: Payload }): Promise<void> {
  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    payload.logger.warn('Skipping footer partner logos — BLOB_READ_WRITE_TOKEN not set on Vercel.')
    return
  }

  let footer: { partners?: unknown }

  try {
    footer = await payload.findGlobal({
      slug: 'footer',
      depth: 0,
    })
  } catch (err) {
    payload.logger.error({ err, msg: 'Failed to read footer before seeding partner logos' })
    return
  }

  if (Array.isArray(footer.partners) && footer.partners.length > 0) return

  try {
    payload.logger.info(
      `Seeding ${CONVENTION_2025_PARTNERS.length} footer partner logo(s) for Convention 2025…`,
    )

    const partners = await seedPartnerLogos({
      payload,
      partners: CONVENTION_2025_PARTNERS,
      assetsDir: PARTNERS_DIR,
    })

    await payload.updateGlobal({
      slug: 'footer',
      data: { partners },
      context: SEED_CONTEXT,
    })
    payload.logger.info('Footer partner logos seeded.')
  } catch (err) {
    payload.logger.error({ err, msg: 'Failed to seed footer partner logos' })
  }
}
