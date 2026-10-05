import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "footer_partners" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "url" varchar,
      "alt" varchar
    );

    CREATE TABLE IF NOT EXISTS "footer_credits" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "role" varchar NOT NULL,
      "name" varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "footer_partners"
        ADD CONSTRAINT "footer_partners_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "footer_partners"
        ADD CONSTRAINT "footer_partners_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "footer_credits"
        ADD CONSTRAINT "footer_credits_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "footer_partners_order_idx"
      ON "footer_partners" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "footer_partners_parent_id_idx"
      ON "footer_partners" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "footer_partners_image_idx"
      ON "footer_partners" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "footer_credits_order_idx"
      ON "footer_credits" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "footer_credits_parent_id_idx"
      ON "footer_credits" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "footer_partners" CASCADE;
    DROP TABLE IF EXISTS "footer_credits" CASCADE;
  `)
}
