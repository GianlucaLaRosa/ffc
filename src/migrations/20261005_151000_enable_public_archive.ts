import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "conference_archive"
    ADD COLUMN IF NOT EXISTS "enable_public_archive" boolean DEFAULT true;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "conference_archive" DROP COLUMN IF EXISTS "enable_public_archive";
  `)
}
