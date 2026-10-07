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
  unstable_shouldAddLocaleToLinks: true,
})

const nextConfig: NextConfig = {
  // payload-plugin-icons loads react-dom/server and lucide-react via opaque runtime imports;
  // Vercel/serverless tracing omits them unless listed explicitly. Scope to /admin only —
  // a '/*' key creates an extra serverless function and exceeds the Hobby plan limit (12).
  outputFileTracingIncludes: {
    '/admin/[[...segments]]': [
      './node_modules/react-dom/**/*',
      './node_modules/lucide-react/**/*',
    ],
  },
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
  i18n: {
    locales: ['en', 'it'],
    defaultLocale: 'en',
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  async rewrites() {
    // Turbopack production builds emit lazy-import URLs as /static/immutable/…
    // but assets are served under /_next/static/immutable/… — without this, Payload admin is a blank page.
    return [
      {
        source: '/static/immutable/:path*',
        destination: '/_next/static/immutable/:path*',
      },
    ]
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
        {
          source: '/:lang(en|it)/docs',
          headers: [
            { key: 'Cache-Control', value: 'private, no-store, max-age=0, must-revalidate' },
            { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          ],
        },
        {
          source: '/:lang(en|it)/docs/:path*',
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
