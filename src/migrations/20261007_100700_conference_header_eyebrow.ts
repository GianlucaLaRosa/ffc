import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "conferences" ADD COLUMN IF NOT EXISTS "header_eyebrow" varchar;
    ALTER TABLE "_conferences_v" ADD COLUMN IF NOT EXISTS "version_header_eyebrow" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "conferences" DROP COLUMN IF EXISTS "header_eyebrow";
    ALTER TABLE "_conferences_v" DROP COLUMN IF EXISTS "version_header_eyebrow";
  `)
}
