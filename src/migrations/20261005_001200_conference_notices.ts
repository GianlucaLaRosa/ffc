import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_conference_notices_severity" AS ENUM('info', 'change', 'urgent');

  CREATE TABLE "conference_notices" (
    "id" serial PRIMARY KEY NOT NULL,
    "_order" varchar,
    "_notices_conference_notices_order" varchar,
    "title" varchar NOT NULL,
    "body" varchar NOT NULL,
    "severity" "enum_conference_notices_severity" DEFAULT 'change' NOT NULL,
    "show_on_site" boolean DEFAULT true,
    "send_push" boolean DEFAULT true,
    "related_agenda_item_id" integer,
    "link_path" varchar,
    "starts_at" timestamp(3) with time zone,
    "expires_at" timestamp(3) with time zone,
    "sent_at" timestamp(3) with time zone,
    "push_sent" numeric,
    "push_removed" numeric,
    "conference_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "conference_notices" ADD CONSTRAINT "conference_notices_related_agenda_item_id_agenda_items_id_fk" FOREIGN KEY ("related_agenda_item_id") REFERENCES "public"."agenda_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conference_notices" ADD CONSTRAINT "conference_notices_conference_id_conferences_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conferences"("id") ON DELETE set null ON UPDATE no action;

  CREATE INDEX "conference_notices__order_idx" ON "conference_notices" USING btree ("_order");
  CREATE INDEX "conference_notices__notices_conference_notices_order_idx" ON "conference_notices" USING btree ("_notices_conference_notices_order");
  CREATE INDEX "conference_notices_related_agenda_item_idx" ON "conference_notices" USING btree ("related_agenda_item_id");
  CREATE INDEX "conference_notices_conference_idx" ON "conference_notices" USING btree ("conference_id");
  CREATE INDEX "conference_notices_updated_at_idx" ON "conference_notices" USING btree ("updated_at");
  CREATE INDEX "conference_notices_created_at_idx" ON "conference_notices" USING btree ("created_at");

  ALTER TABLE "programme_push_subscriptions" ADD COLUMN "conference_updates" boolean DEFAULT true;
  CREATE INDEX "programme_push_subscriptions_conference_updates_idx" ON "programme_push_subscriptions" USING btree ("conference_updates");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "conference_notices_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conference_notices_fk" FOREIGN KEY ("conference_notices_id") REFERENCES "public"."conference_notices"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_conference_notices_id_idx" ON "payload_locked_documents_rels" USING btree ("conference_notices_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_conference_notices_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_conference_notices_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "conference_notices_id";

  DROP INDEX IF EXISTS "programme_push_subscriptions_conference_updates_idx";
  ALTER TABLE "programme_push_subscriptions" DROP COLUMN IF EXISTS "conference_updates";

  DROP TABLE IF EXISTS "conference_notices" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_conference_notices_severity";
  `)
}
