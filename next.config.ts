import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import nextra from 'nextra'
import path from 'path'
import { fileURLToPath } from 'url'
import { withPayloadIcons } from 'payload-plugin-icons'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const withNextra = nextra({
  contentDirBasePath: '/docs',
  defaultShowCopyCode: true,
  search: false,
})

const nextConfig: NextConfig = {
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  env: {
    NEXTRA_LOCALES: JSON.stringify(['']),
    NEXTRA_SHOULD_ADD_LOCALE_TO_LINKS: 'false',
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  async headers() {
    return [
        {
          source: '/sw.js',
          headers: [
            { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
            { key: 'Service-Worker-Allowed', value: '/' },
          ],
        },
        {
          source: '/docs',
          headers: [
            { key: 'Cache-Control', value: 'private, no-store, max-age=0, must-revalidate' },
            { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          ],
        },
        {
          source: '/docs/:path*',
          headers: [
            { key: 'Cache-Control', value: 'private, no-store, max-age=0, must-revalidate' },
            { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          ],
        },
    ]
  },
}

export default withNextra(
  withPayload(withPayloadIcons(nextConfig), { devBundleServerPackages: false }),
)
