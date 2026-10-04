import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_conferences_intro_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__conferences_v_version_intro_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TABLE "conferences_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_conferences_intro_size" DEFAULT 'full',
  	"content" jsonb
  );
  
  CREATE TABLE "_conferences_v_version_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__conferences_v_version_intro_size" DEFAULT 'full',
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  ALTER TABLE "conferences_intro" ADD CONSTRAINT "conferences_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_conferences_v_version_intro" ADD CONSTRAINT "_conferences_v_version_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_conferences_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "conferences_intro_order_idx" ON "conferences_intro" USING btree ("_order");
  CREATE INDEX "conferences_intro_parent_id_idx" ON "conferences_intro" USING btree ("_parent_id");
  CREATE INDEX "_conferences_v_version_intro_order_idx" ON "_conferences_v_version_intro" USING btree ("_order");
  CREATE INDEX "_conferences_v_version_intro_parent_id_idx" ON "_conferences_v_version_intro" USING btree ("_parent_id");
  INSERT INTO "conferences_intro" ("_order", "_parent_id", "id", "size", "content")
  SELECT 1, "id", gen_random_uuid()::varchar, 'full', "description"
  FROM "conferences"
  WHERE "description" IS NOT NULL;
  INSERT INTO "_conferences_v_version_intro" ("_order", "_parent_id", "size", "content", "_uuid")
  SELECT 1, "id", 'full', "version_description", gen_random_uuid()::varchar
  FROM "_conferences_v"
  WHERE "version_description" IS NOT NULL;
  ALTER TABLE "conferences" DROP COLUMN "description";
  ALTER TABLE "_conferences_v" DROP COLUMN "version_description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "conferences" ADD COLUMN "description" jsonb;
  ALTER TABLE "_conferences_v" ADD COLUMN "version_description" jsonb;
  UPDATE "conferences" SET "description" = "conferences_intro"."content"
  FROM "conferences_intro"
  WHERE "conferences_intro"."_parent_id" = "conferences"."id" AND "conferences_intro"."_order" = 1;
  UPDATE "_conferences_v" SET "version_description" = "_conferences_v_version_intro"."content"
  FROM "_conferences_v_version_intro"
  WHERE "_conferences_v_version_intro"."_parent_id" = "_conferences_v"."id" AND "_conferences_v_version_intro"."_order" = 1;
  DROP TABLE "conferences_intro" CASCADE;
  DROP TABLE "_conferences_v_version_intro" CASCADE;
  DROP TYPE "public"."enum_conferences_intro_size";
  DROP TYPE "public"."enum__conferences_v_version_intro_size";`)
}
