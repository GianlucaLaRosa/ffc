# FCR Payload overlay — playbook for the integrating agent

The **target** app already has Next.js App Router, Payload, and Neon. This kit is the FCR conference **admin + schema**, not the FCR public site.

Follow `MANIFEST.md`. Copy files from `overlay/` into the target using the same paths (`src/...`). Read `reference/payload.config.fcr.ts` and **merge** it; do not replace the target `payload.config.ts` wholesale.

## Goal

Admin at `/admin` can edit:

- Conferences (hub) + hidden children: conference-days, agenda-items, appendices, abstracts
- People, Institutions
- Reference: countries, italian-regions, abstract-statuses
- Globals: `active-conference`, `conference-archive`, `footer` (see collisions)
- Media (folders) + Users (auth)

Public UI stays the target’s. After schema lands, map Local API / REST to existing components.

## Hard rules

1. **Do not apply** `reference/migrations/20261003_180122_baseline.ts` on Neon if Payload already ran migrations. That baseline is a full schema for an empty DB. On the target, after merging config, run **`payload migrate:create`** and then **`payload migrate`**.
2. **Do not overwrite** `src/payload-types.ts` or `importMap.js` from FCR. Regenerate on the target.
3. **Do not overwrite** the target Postgres adapter / Neon URL. Keep `push: false` if they already use migrations.
4. **Do not copy** FCR frontend pages. Skip `Footer/Component.tsx` and `MediaBlock/Component.tsx`.
5. Keep **`@/`** imports. Target `tsconfig` must have `"@/*": ["./src/*"]` and `"@payload-config": ["./src/payload.config.ts"]` (or equivalent).
6. Pin Payload packages to the **same minor** as this kit (3.90.x) or upgrade FCR and target together. Mixed `@payloadcms/*` versions break the admin.
7. Venue coordinates in this schema are two numbers (`longitude`, `latitude`), **not** `point`.

## Collisions (decide, then proceed)

The target likely ships the Payload website template (`pages`, `posts`, `users`, `media`, `footer`).

| Slug | What to do |
| --- | --- |
| `users` | **Keep the target Users** if it has roles/extra fields. Ensure `auth: true` and that `admin.user` still points at it. Add `name` if missing. Set `admin.group: 'Content'` if you want FCR sidebar grouping. |
| `media` | **Merge** FCR into the target Media: `folders: true`, existing upload sizes can stay. FCR `onInit` creates three folders (logos, people photos, abstract pictures). |
| `footer` | If the target UI already renders a Footer global, **do not replace** the schema until the frontend is adapted. Either keep target Footer and skip FCR Footer, or replace schema and update the UI. FCR Footer fields: `structure`, `delegation`, `navItems` (links to `conferences`). |
| `pages` / `posts` / … | Keep if the existing UI uses them. Hide in admin (`admin.hidden`) if editors should only see the FCR conference hub. |
| `payload.config` plugins | Spread FCR `seoPlugin` **and** keep existing plugins (form builder, redirects, nested docs, etc.). |

## Copy order

1. Install missing deps from `snippets/package.dependencies.json` (skip packages already present at a compatible version). Add `payload-plugin-icons` + `@phosphor-icons/react` if missing.
2. Copy `overlay/src/**` into the target `src/**` (collections, fields, access, admin components, globals, utilities, seed data, MediaBlock **config only**).
3. Copy `overlay/.cursor/rules/payload-collections.mdc` into the target if they use Cursor.
4. Merge `payload.config.ts` (next section).
5. Merge `next.config` per `snippets/next.config.notes.md`.
6. Env per `snippets/env.notes.md`.
7. `pnpm payload generate:types` then `pnpm payload generate:importmap`.
8. `pnpm payload migrate:create` (name e.g. `fcr_conference_cms`) then `pnpm payload migrate`.
9. Start admin, log in, confirm groups and a Conference document.

If a copied file imports `@/payload-types`, that file must exist after generate:types (it already should).

## Merge `payload.config.ts`

Use `reference/payload.config.fcr.ts` as the FCR checklist. Keep the target’s `db` adapter (Neon), `secret`, `sharp`, `typescript.outputFile`, and existing collections you are not replacing.

**admin.components** — add (keep any the target already has):

```ts
beforeLogin: ['@/components/BeforeLogin'], // optional
afterNavLinks: ['@/components/admin/SiteNavGroup'],
beforeDashboard: ['@/components/admin/SiteDashboardGroup'],
```

**collections** — register these slugs (imports from `@/collections/...`):

`media`, `users` (existing), `abstract-statuses`, `abstracts`, `appendices`, `agenda-items`, `conference-days`, `conferences`, `countries`, `institutions`, `italian-regions`, `people`

**globals:** `Footer`, `ActiveConference`, `ConferenceArchive`

**editor:** you may keep the target default Lexical. FCR collections pass `basicLexical` / `flexibleLexical` per field. Still add FCR `iconPlugin` to `plugins`.

**plugins:**

```ts
plugins: [
  ...existingTargetPlugins,
  ...fcrPlugins, // seoPlugin generateTitle/generateURL for conferences
  iconPlugin,
  // vercelBlobStorage({ collections: { media: true }, token }) only if the target uses Blob
],
```

Adapt SEO `generateURL` to the **target** public routes. FCR uses `{server}/archive/{slug}` and site root for the active edition. If the target UI uses different paths, change `src/plugins/index.ts` (or the merged seo config) accordingly.

**onInit:** call FCR seed + `ensureMediaFolder` for the three folder names. Keep the target’s existing onInit work. The “move existing uploads into folders” loops are safe but can be slow; they are optional on a large media library.

**jobs:** copy FCR `jobs.access.run` only if the target has jobs/cron; otherwise omit.

## Adapt after copy (required)

Cache revalidation hooks call `revalidateTag` with **FCR** tags:

- `src/collections/Conferences/hooks/revalidatePublicArchive.ts` — `conference-archive`, `conference_${slug}`
- `src/ActiveConference/hooks/revalidateActiveConference.ts`
- `src/Footer/hooks/revalidateFooter.ts` — `global_footer`

Point these at tags the target frontend actually uses, or no-op them until the UI reads Payload.

`src/fields/link.ts` `relationTo: ['conferences']`. If the target Footer/nav still links to `pages`, extend `relationTo` instead of dropping pages.

## Public URL contract (for the existing UI)

When wiring the frontend (not required for admin to boot):

- Global `active-conference.conference` → published edition at `/` (FCR). Change if the target uses another path.
- `conferences.publicArchive === true` → `/archive/{slug}` (FCR).
- Fetch ordered lists with `sort: '_order'` (Payload `orderable`).
- Drafts: public read is `authenticatedOrPublished` or `anyone` depending on collection. Use `draft: false` / `_status: published` on the public site.
- Do not use Payload `point` for venue; use `longitude` / `latitude`.

JSON-LD / SEO meta live on the conference document (`meta`, `geo`). Emit them from the target pages if needed; FCR frontend helpers were not copied.

## Verification

- `/admin` loads; import map has custom fields (`ColorField`, `LucideIconField`, `ArchiveManager`, agenda time fields, abstract fields).
- Sidebar: Conferences hub; nested edition collections hidden; People & orgs; Reference lookups; Site links for active conference + archive.
- Create/edit a conference: name (rich text) fills read-only `title`; slug works; days join; media folder for logo after save.
- Seed: countries, italian-regions, abstract-statuses exist after first boot (`onInit`).
- `pnpm payload generate:types` is clean.
- Neon: new tables/columns from the **new** migration only; `payload_migrations` did not try to re-run FCR `20261003_180122_baseline`.

## If admin is blank or crashes

- Missing `generate:importmap` after adding `admin.components` paths.
- Broken `@/` path for a custom Field.
- Payload version mismatch.
- Overwrote `users` and lost the only admin account — restore from backup / create user via Payload CLI if available.

## Out of scope (do later)

Mapping the target UI components to this schema, live preview URLs, and FCR-specific redirects (`/archive/{activeSlug}` → `/`).
