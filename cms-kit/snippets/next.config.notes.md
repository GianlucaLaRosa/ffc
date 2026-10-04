# next.config — Payload wiring

The target app already has Payload. Keep its `withPayload(...)` wrapper.

Ensure these exist (merge, do not replace the whole config):

```ts
import { withPayload } from '@payloadcms/next/withPayload'
import { withPayloadIcons } from 'payload-plugin-icons'

export default withPayload(withPayloadIcons(nextConfig), {
  devBundleServerPackages: false,
})
```

Also typical for Payload admin CSS on Next:

```ts
sassOptions: {
  loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
},
```

If `images.remotePatterns` / `images.localPatterns` already allow your media host (Neon/Vercel Blob / `/api/media/file/**`), leave them. Add Blob hostnames if uploads fail to render in admin.

Do **not** copy FCR `redirects` unless the public URL scheme (`/` vs `/archive/{slug}`) is the same.
