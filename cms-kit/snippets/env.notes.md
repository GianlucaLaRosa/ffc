# Env (keep Neon as already configured)

Do **not** rename the target's database URL if it already works (`POSTGRES_URL` or `DATABASE_URL`). Point the Postgres adapter at the existing Neon connection.

Required for this overlay:

- `PAYLOAD_SECRET` — already present
- Neon connection string used by `@payloadcms/db-vercel-postgres`
- `NEXT_PUBLIC_SERVER_URL` — no trailing slash (CORS + SEO URLs)

Optional / keep if already used:

- `BLOB_READ_WRITE_TOKEN` — only if you keep `vercelBlobStorage` from FCR
- `CRON_SECRET` — only if you keep Payload jobs auth from FCR `payload.config`
- `PREVIEW_SECRET` — only if you enable live preview

FCR `payload.config` reads `process.env.POSTGRES_URL`. If the target uses `DATABASE_URL`, keep the target adapter code and **do not** switch the env name just to match FCR.
