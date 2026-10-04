import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Conference } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Conference> = ({ doc }) => {
  return doc?.title ? `${doc.title} | FCR` : 'FCR'
}

const generateURL: GenerateURL<Conference> = ({ doc }) => {
  const url = getServerSideURL()

  if (!doc?.slug) return url

  return `${url}/archive/${doc.slug}`
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
