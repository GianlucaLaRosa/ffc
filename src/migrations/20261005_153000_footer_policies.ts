import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "footer"
      ADD COLUMN IF NOT EXISTS "cookie_policy_title" varchar DEFAULT 'Cookie Policy',
      ADD COLUMN IF NOT EXISTS "cookie_policy_kicker" varchar,
      ADD COLUMN IF NOT EXISTS "cookie_policy_header_badge" varchar,
      ADD COLUMN IF NOT EXISTS "cookie_policy_last_updated" varchar,
      ADD COLUMN IF NOT EXISTS "cookie_policy_meta_description" varchar,
      ADD COLUMN IF NOT EXISTS "cookie_policy_intro" jsonb,
      ADD COLUMN IF NOT EXISTS "cookie_policy_summary_title" varchar,
      ADD COLUMN IF NOT EXISTS "cookie_policy_summary" jsonb,
      ADD COLUMN IF NOT EXISTS "cookie_policy_content" jsonb,
      ADD COLUMN IF NOT EXISTS "privacy_policy_title" varchar DEFAULT 'Privacy Policy',
      ADD COLUMN IF NOT EXISTS "privacy_policy_kicker" varchar,
      ADD COLUMN IF NOT EXISTS "privacy_policy_header_badge" varchar,
      ADD COLUMN IF NOT EXISTS "privacy_policy_last_updated" varchar,
      ADD COLUMN IF NOT EXISTS "privacy_policy_meta_description" varchar,
      ADD COLUMN IF NOT EXISTS "privacy_policy_intro" jsonb,
      ADD COLUMN IF NOT EXISTS "privacy_policy_controller_name" varchar,
      ADD COLUMN IF NOT EXISTS "privacy_policy_controller_address" varchar,
      ADD COLUMN IF NOT EXISTS "privacy_policy_controller_website" varchar,
      ADD COLUMN IF NOT EXISTS "privacy_policy_content" jsonb,
      ADD COLUMN IF NOT EXISTS "privacy_policy_rights_heading" varchar,
      ADD COLUMN IF NOT EXISTS "privacy_policy_rights_intro" jsonb,
      ADD COLUMN IF NOT EXISTS "privacy_policy_complaint_note" jsonb;

    CREATE TABLE IF NOT EXISTS "footer_cookie_policy_highlights" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "footer_privacy_policy_rights" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "footer_cookie_policy_highlights"
        ADD CONSTRAINT "footer_cookie_policy_highlights_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "footer_privacy_policy_rights"
        ADD CONSTRAINT "footer_privacy_policy_rights_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "footer_cookie_policy_highlights_order_idx"
      ON "footer_cookie_policy_highlights" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "footer_cookie_policy_highlights_parent_id_idx"
      ON "footer_cookie_policy_highlights" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "footer_privacy_policy_rights_order_idx"
      ON "footer_privacy_policy_rights" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "footer_privacy_policy_rights_parent_id_idx"
      ON "footer_privacy_policy_rights" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "footer_cookie_policy_highlights" CASCADE;
    DROP TABLE IF EXISTS "footer_privacy_policy_rights" CASCADE;

    ALTER TABLE "footer"
      DROP COLUMN IF EXISTS "cookie_policy_title",
      DROP COLUMN IF EXISTS "cookie_policy_kicker",
      DROP COLUMN IF EXISTS "cookie_policy_header_badge",
      DROP COLUMN IF EXISTS "cookie_policy_last_updated",
      DROP COLUMN IF EXISTS "cookie_policy_meta_description",
      DROP COLUMN IF EXISTS "cookie_policy_intro",
      DROP COLUMN IF EXISTS "cookie_policy_summary_title",
      DROP COLUMN IF EXISTS "cookie_policy_summary",
      DROP COLUMN IF EXISTS "cookie_policy_content",
      DROP COLUMN IF EXISTS "privacy_policy_title",
      DROP COLUMN IF EXISTS "privacy_policy_kicker",
      DROP COLUMN IF EXISTS "privacy_policy_header_badge",
      DROP COLUMN IF EXISTS "privacy_policy_last_updated",
      DROP COLUMN IF EXISTS "privacy_policy_meta_description",
      DROP COLUMN IF EXISTS "privacy_policy_intro",
      DROP COLUMN IF EXISTS "privacy_policy_controller_name",
      DROP COLUMN IF EXISTS "privacy_policy_controller_address",
      DROP COLUMN IF EXISTS "privacy_policy_controller_website",
      DROP COLUMN IF EXISTS "privacy_policy_content",
      DROP COLUMN IF EXISTS "privacy_policy_rights_heading",
      DROP COLUMN IF EXISTS "privacy_policy_rights_intro",
      DROP COLUMN IF EXISTS "privacy_policy_complaint_note";
  `)
}
