# Manifest

Paths are relative to the **target** repo root after copy. Source files live in `overlay/` (same relative path) unless noted.

| Path | Action | Notes |
| --- | --- | --- |
| `src/collections/**` | **copy** | FCR collections. Overwrite if the target has stubs with the same slugs. |
| `src/collections/Users/index.ts` | **merge** | Prefer the target Users (roles, extra fields). See PLAYBOOK collisions. |
| `src/collections/Media.ts` | **merge** | Keep target upload config; add `folders: true` from FCR. |
| `src/fields/**` | **copy** | Includes Lexical presets, color, icon, link. |
| `src/access/**` | **merge** | Keep extra access helpers the target already has. |
| `src/hooks/populatePublishedAt.ts` | **copy** | Used by conferences. |
| `src/components/admin/**` | **copy** | Admin nav/dashboard + shadcn under `admin/ui`, not `components/ui`. |
| `src/components/BeforeLogin/**` | **copy** | Optional; referenced from FCR admin config. |
| `src/ActiveConference/**` | **copy** | Global + admin NavLink. |
| `src/ConferenceArchive/**` | **copy** | Global + ArchiveManager UI. |
| `src/Footer/config.ts` | **merge** | See PLAYBOOK: may collide with website-template Footer. |
| `src/Footer/hooks/revalidateFooter.ts` | **adapt** | Cache tags belong to the target frontend. |
| `src/blocks/MediaBlock/config.ts` | **copy** | Admin Lexical block. Do **not** overwrite a frontend `Component.tsx`. |
| `src/plugins/index.ts` | **merge** | FCR file is SEO for conferences. Spread into existing `plugins`. |
| `src/utilities/mediaFolder.ts` | **copy** | |
| `src/utilities/appendixInstitutions.ts` | **copy** | |
| `src/utilities/seed*.ts` | **copy** | |
| `src/utilities/deepMerge.ts` | **copy if missing** | |
| `src/utilities/ui.ts` (`cn`) | **copy if missing** | |
| `src/utilities/getURL.ts` | **copy if missing** | |
| `src/utilities/canUseDOM.ts` | **copy if missing** | |
| `src/seed/data/**` | **copy** | Country / region seed lists. |
| `src/payload.config.ts` | **merge** | Source of truth: `reference/payload.config.fcr.ts`. Never overwrite blindly. |
| `src/app/(payload)/**` | **skip if present** | Target already has Payload routes. Template: `reference/app-payload/`. |
| `src/payload-types.ts` | **generate** | `pnpm payload generate:types` on the target. |
| `src/app/(payload)/admin/importMap.js` | **generate** | `pnpm payload generate:importmap`. |
| `src/migrations/**` (FCR baseline) | **do not apply** | Target Neon already has Payload tables. Create a **new** migration on the target. Baseline is in `reference/migrations/` for empty DBs only. |
| `.cursor/rules/payload-collections.mdc` | **copy** | Editor conventions. |

## Do not copy

- Public pages, layouts, `Footer/Component.tsx`, `MediaBlock/Component.tsx`
- FCR `next.config.ts` redirects / sitemap
- `importMap.js`, generated types
- FCR baseline migration onto an existing Neon database
