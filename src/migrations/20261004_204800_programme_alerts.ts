import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "programme_alerts" (
    "id" serial PRIMARY KEY NOT NULL,
    "enabled" boolean DEFAULT true,
    "contact_email" varchar,
    "lead_minutes" numeric DEFAULT 5,
    "notification_title" varchar DEFAULT 'FFC Conference',
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "programme_alerts" CASCADE;
  `)
}
