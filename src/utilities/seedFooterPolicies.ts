import type { Payload } from 'payload'

import type { Footer } from '@/payload-types'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import { COOKIE_POLICY_SEED, PRIVACY_POLICY_SEED } from '../seed/data/footerPolicies'

type LexicalJSON = Parameters<typeof convertLexicalToPlaintext>[0]['data']

const lexicalHasText = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false
  try {
    return convertLexicalToPlaintext({ data: value as LexicalJSON }).trim().length > 0
  } catch {
    return false
  }
}

const withIconProvider = (group: {
  icon?: { provider?: string | null; name?: string | null } | null
  label?: string | null
  url?: string | null
} | null | undefined) => ({
  icon: {
    provider: group?.icon?.provider || 'lucide',
    name: group?.icon?.name ?? null,
  },
  label: group?.label ?? null,
  url: group?.url ?? null,
})

/**
 * Fills Footer Cookie Policy / Privacy Policy from the current public copy when empty.
 */
export async function seedFooterPolicies({ payload }: { payload: Payload }): Promise<void> {
  let footer: {
    structure?: {
      icon?: { provider?: string | null; name?: string | null } | null
      label?: string | null
      url?: string | null
    } | null
    delegation?: {
      icon?: { provider?: string | null; name?: string | null } | null
      label?: string | null
      url?: string | null
    } | null
    partners?: unknown
    credits?: unknown
    cookiePolicy?: { content?: unknown } | null
    privacyPolicy?: { content?: unknown } | null
  }

  try {
    footer = await payload.findGlobal({
      slug: 'footer',
      depth: 0,
    })
  } catch (err) {
    payload.logger.error({ err, msg: 'Failed to read footer before seeding policies' })
    return
  }

  const cookieEmpty = !lexicalHasText(footer.cookiePolicy?.content)
  const privacyEmpty = !lexicalHasText(footer.privacyPolicy?.content)

  if (!cookieEmpty && !privacyEmpty) return

  try {
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        structure: withIconProvider(footer.structure),
        delegation: withIconProvider(footer.delegation),
        partners: Array.isArray(footer.partners) ? footer.partners : [],
        credits: Array.isArray(footer.credits) ? footer.credits : [],
        ...(cookieEmpty
          ? { cookiePolicy: COOKIE_POLICY_SEED as NonNullable<Footer['cookiePolicy']> }
          : {}),
        ...(privacyEmpty
          ? { privacyPolicy: PRIVACY_POLICY_SEED as NonNullable<Footer['privacyPolicy']> }
          : {}),
      },
      context: { disableRevalidate: true },
    })
  } catch (err) {
    payload.logger.error({ err, msg: 'Failed to seed footer Cookie Policy / Privacy Policy' })
  }
}
