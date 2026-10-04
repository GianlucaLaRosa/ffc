# Merge `package.json` (do not replace the target file)

Source: `snippets/package.json`. The target already has Next + Payload + Neon.

## Scripts

Add these if missing. Keep the target’s `dev` / `build` / `start` / `lint`.

| Script | Why |
| --- | --- |
| `payload` | CLI (`migrate`, `migrate:create`, …) |
| `generate:types` | After schema merge |
| `generate:importmap` | After admin `components` paths |
| `ci` | Run migrations before build (Vercel). If the target already has `ci`, keep `payload migrate` in that pipeline — do not drop their extra steps. |

`cross-env NODE_OPTIONS=--no-deprecation` matches FCR. On Unix-only scripts you may omit `cross-env` if it is not installed.

Do **not** copy FCR `postbuild` (`next-sitemap`) unless the target already uses that sitemap config.

## Dependencies

Install **missing** packages only. Prefer aligning all `@payloadcms/*` + `payload` to the **same** version (kit: `3.90.0`). Do not mix minors.

**Required for this overlay**

- `payload-plugin-icons`, `@phosphor-icons/react` (peer), `lucide-react`
- `@payloadcms/plugin-seo`
- `@radix-ui/react-popover`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge` (admin color picker)
- `graphql`, `sharp` (usually already present)

**Already expected on the target** (install only if absent)

- `payload`, `@payloadcms/next`, `@payloadcms/ui`, `@payloadcms/richtext-lexical`, `@payloadcms/db-vercel-postgres`

**Optional**

- `@payloadcms/storage-vercel-blob` — only if you keep FCR Blob storage
- `@payloadcms/admin-bar`, `@payloadcms/live-preview-react` — frontend, not required for admin schema

**Do not install from FCR just because they exist there**

- `geist`, `next-sitemap`, `prism-react-renderer` — FCR public site

If the target already has a **newer** consistent Payload 3.x set, keep it; do not downgrade blindly. Then do not pin `3.90.0` from this fragment.

## pnpm

Merge `pnpm.onlyBuiltDependencies` so `sharp` can build. Do not replace the whole `pnpm` key if the target has other settings.
