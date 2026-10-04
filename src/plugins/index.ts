import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Conference } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { conferencePublicPath, relationSlug } from '@/utilities/conferenceRoutes'

const generateTitle: GenerateTitle<Conference> = ({ doc }) => {
  return doc?.title ? `${doc.title} | FFC` : 'FFC Conference'
}

const generateURL: GenerateURL<Conference> = async ({ doc, req }) => {
  const origin = getServerSideURL()
  if (!doc?.slug) return origin

  let activeSlug: string | null = null
  try {
    const payload = req?.payload
    if (payload) {
      const active = await payload.findGlobal({
        slug: 'active-conference',
        depth: 1,
        req,
      })
      activeSlug = relationSlug(
        typeof active?.conference === 'object' ? active.conference : null,
      )
    }
  } catch {
    activeSlug = null
  }

  const path = conferencePublicPath({
    slug: doc.slug,
    publicArchive: doc.publicArchive,
    activeSlug,
  })

  if (!path) return origin
  return path === '/' ? origin : `${origin}${path}`
}

const applySeo = seoPlugin({
  collections: ['conferences'],
  generateTitle,
  generateURL,
})

export const plugins: Plugin[] = [
  (config) => {
    const withSeo = applySeo(config)
    // SEO fields are placed manually on Conferences (Public listing tab).
    // `collections` is required so /api/plugin-seo/generate-* can authorize;
    // keep our schema and drop the plugin's duplicate `meta` group.
    return {
      ...withSeo,
      collections: config.collections,
      globals: config.globals,
    }
  },
]
