import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "programme_push_subscriptions" (
    "id" serial PRIMARY KEY NOT NULL,
    "endpoint" varchar NOT NULL,
    "p256dh" varchar NOT NULL,
    "auth" varchar NOT NULL,
    "conference" numeric NOT NULL,
    "canonical_path" varchar DEFAULT '/',
    "items" jsonb NOT NULL,
    "notified_soon" jsonb,
    "notified_live" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "programme_push_subscriptions" ADD CONSTRAINT "programme_push_subscriptions_endpoint_unique" UNIQUE("endpoint");
  CREATE INDEX "programme_push_subscriptions_endpoint_idx" ON "programme_push_subscriptions" USING btree ("endpoint");
  CREATE INDEX "programme_push_subscriptions_conference_idx" ON "programme_push_subscriptions" USING btree ("conference");
  CREATE INDEX "programme_push_subscriptions_updated_at_idx" ON "programme_push_subscriptions" USING btree ("updated_at");
  CREATE INDEX "programme_push_subscriptions_created_at_idx" ON "programme_push_subscriptions" USING btree ("created_at");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "programme_push_subscriptions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programme_push_subscriptions_fk" FOREIGN KEY ("programme_push_subscriptions_id") REFERENCES "public"."programme_push_subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_programme_push_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("programme_push_subscriptions_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_programme_push_subscriptions_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_programme_push_subscriptions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "programme_push_subscriptions_id";
  DROP TABLE IF EXISTS "programme_push_subscriptions" CASCADE;
  `)
}
