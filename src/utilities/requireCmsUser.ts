import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@payload-config'

/** Require a logged-in CMS user (same cookie as /admin). */
export async function requireCmsUser(redirectAfterLogin = '/docs'): Promise<void> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (user) return

  const next = redirectAfterLogin.startsWith('/') ? redirectAfterLogin : '/docs'
  redirect(`/admin/login?redirect=${encodeURIComponent(next)}`)
}
