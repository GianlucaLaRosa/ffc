import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "conference_notices__notices_conference_notices_order_idx";
  ALTER TABLE "conference_notices" RENAME COLUMN "_notices_conference_notices_order" TO "_conference_notices_notices_order";
  CREATE INDEX "conference_notices__conference_notices_notices_order_idx" ON "conference_notices" USING btree ("_conference_notices_notices_order");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "conference_notices__conference_notices_notices_order_idx";
  ALTER TABLE "conference_notices" RENAME COLUMN "_conference_notices_notices_order" TO "_notices_conference_notices_order";
  CREATE INDEX "conference_notices__notices_conference_notices_order_idx" ON "conference_notices" USING btree ("_notices_conference_notices_order");
  `)
}
