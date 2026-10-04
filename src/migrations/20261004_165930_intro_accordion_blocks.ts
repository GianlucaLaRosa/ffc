import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_conferences_blocks_content_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_conferences_blocks_accordion_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__conferences_v_blocks_content_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__conferences_v_blocks_accordion_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TABLE "conferences_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_conferences_blocks_content_size" DEFAULT 'full',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "conferences_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"default_open" boolean DEFAULT false
  );
  
  CREATE TABLE "conferences_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_conferences_blocks_accordion_size" DEFAULT 'full',
  	"block_name" varchar
  );
  
  CREATE TABLE "_conferences_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__conferences_v_blocks_content_size" DEFAULT 'full',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_conferences_v_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"default_open" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_conferences_v_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__conferences_v_blocks_accordion_size" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  INSERT INTO "conferences_blocks_content" ("_order", "_parent_id", "_path", "id", "size", "content", "block_name")
  SELECT "_order", "_parent_id", 'intro', "id", "size"::text::"enum_conferences_blocks_content_size", "content", NULL
  FROM "conferences_intro";
  INSERT INTO "_conferences_v_blocks_content" ("_order", "_parent_id", "_path", "size", "content", "_uuid", "block_name")
  SELECT "_order", "_parent_id", 'intro', "size"::text::"enum__conferences_v_blocks_content_size", "content", COALESCE("_uuid", gen_random_uuid()::varchar), NULL
  FROM "_conferences_v_version_intro";
  DROP TABLE "conferences_intro" CASCADE;
  DROP TABLE "_conferences_v_version_intro" CASCADE;
  ALTER TABLE "conferences_blocks_content" ADD CONSTRAINT "conferences_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conferences_blocks_accordion_items" ADD CONSTRAINT "conferences_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conferences_blocks_accordion" ADD CONSTRAINT "conferences_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_conferences_v_blocks_content" ADD CONSTRAINT "_conferences_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_conferences_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_conferences_v_blocks_accordion_items" ADD CONSTRAINT "_conferences_v_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_conferences_v_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_conferences_v_blocks_accordion" ADD CONSTRAINT "_conferences_v_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_conferences_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "conferences_blocks_content_order_idx" ON "conferences_blocks_content" USING btree ("_order");
  CREATE INDEX "conferences_blocks_content_parent_id_idx" ON "conferences_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "conferences_blocks_content_path_idx" ON "conferences_blocks_content" USING btree ("_path");
  CREATE INDEX "conferences_blocks_accordion_items_order_idx" ON "conferences_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "conferences_blocks_accordion_items_parent_id_idx" ON "conferences_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "conferences_blocks_accordion_order_idx" ON "conferences_blocks_accordion" USING btree ("_order");
  CREATE INDEX "conferences_blocks_accordion_parent_id_idx" ON "conferences_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "conferences_blocks_accordion_path_idx" ON "conferences_blocks_accordion" USING btree ("_path");
  CREATE INDEX "_conferences_v_blocks_content_order_idx" ON "_conferences_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_conferences_v_blocks_content_parent_id_idx" ON "_conferences_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_conferences_v_blocks_content_path_idx" ON "_conferences_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_conferences_v_blocks_accordion_items_order_idx" ON "_conferences_v_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "_conferences_v_blocks_accordion_items_parent_id_idx" ON "_conferences_v_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_conferences_v_blocks_accordion_order_idx" ON "_conferences_v_blocks_accordion" USING btree ("_order");
  CREATE INDEX "_conferences_v_blocks_accordion_parent_id_idx" ON "_conferences_v_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "_conferences_v_blocks_accordion_path_idx" ON "_conferences_v_blocks_accordion" USING btree ("_path");
  DROP TYPE "public"."enum_conferences_intro_size";
  DROP TYPE "public"."enum__conferences_v_version_intro_size";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
  
  INSERT INTO "conferences_intro" ("_order", "_parent_id", "id", "size", "content")
  SELECT "_order", "_parent_id", "id", "size"::text::"enum_conferences_intro_size", "content"
  FROM "conferences_blocks_content";
  INSERT INTO "_conferences_v_version_intro" ("_order", "_parent_id", "size", "content", "_uuid")
  SELECT "_order", "_parent_id", "size"::text::"enum__conferences_v_version_intro_size", "content", "_uuid"
  FROM "_conferences_v_blocks_content";
  DROP TABLE "conferences_blocks_content" CASCADE;
  DROP TABLE "conferences_blocks_accordion_items" CASCADE;
  DROP TABLE "conferences_blocks_accordion" CASCADE;
  DROP TABLE "_conferences_v_blocks_content" CASCADE;
  DROP TABLE "_conferences_v_blocks_accordion_items" CASCADE;
  DROP TABLE "_conferences_v_blocks_accordion" CASCADE;
  ALTER TABLE "conferences_intro" ADD CONSTRAINT "conferences_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_conferences_v_version_intro" ADD CONSTRAINT "_conferences_v_version_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_conferences_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "conferences_intro_order_idx" ON "conferences_intro" USING btree ("_order");
  CREATE INDEX "conferences_intro_parent_id_idx" ON "conferences_intro" USING btree ("_parent_id");
  CREATE INDEX "_conferences_v_version_intro_order_idx" ON "_conferences_v_version_intro" USING btree ("_order");
  CREATE INDEX "_conferences_v_version_intro_parent_id_idx" ON "_conferences_v_version_intro" USING btree ("_parent_id");
  DROP TYPE "public"."enum_conferences_blocks_content_size";
  DROP TYPE "public"."enum_conferences_blocks_accordion_size";
  DROP TYPE "public"."enum__conferences_v_blocks_content_size";
  DROP TYPE "public"."enum__conferences_v_blocks_accordion_size";`)
}
