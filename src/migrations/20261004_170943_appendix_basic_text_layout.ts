import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_appendices_blocks_content_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_appendices_blocks_accordion_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_appendices_blocks_callout_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_appendices_blocks_callout_tone" AS ENUM('note', 'important', 'deadline');
  CREATE TYPE "public"."enum_appendices_blocks_cta_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_appendices_blocks_cta_destination" AS ENUM('programme', 'venue', 'appendix', 'custom');
  CREATE TYPE "public"."enum_appendices_blocks_cta_appearance" AS ENUM('solid', 'outline');
  CREATE TYPE "public"."enum_appendices_blocks_quote_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_appendices_blocks_separator_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_appendices_blocks_separator_style" AS ENUM('line', 'space');
  CREATE TYPE "public"."enum__appendices_v_blocks_content_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__appendices_v_blocks_accordion_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__appendices_v_blocks_callout_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__appendices_v_blocks_callout_tone" AS ENUM('note', 'important', 'deadline');
  CREATE TYPE "public"."enum__appendices_v_blocks_cta_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__appendices_v_blocks_cta_destination" AS ENUM('programme', 'venue', 'appendix', 'custom');
  CREATE TYPE "public"."enum__appendices_v_blocks_cta_appearance" AS ENUM('solid', 'outline');
  CREATE TYPE "public"."enum__appendices_v_blocks_quote_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__appendices_v_blocks_separator_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__appendices_v_blocks_separator_style" AS ENUM('line', 'space');
  CREATE TABLE "appendices_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_appendices_blocks_content_size" DEFAULT 'full',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "appendices_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"default_open" boolean DEFAULT false
  );
  
  CREATE TABLE "appendices_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_appendices_blocks_accordion_size" DEFAULT 'full',
  	"block_name" varchar
  );
  
  CREATE TABLE "appendices_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_appendices_blocks_callout_size" DEFAULT 'full',
  	"tone" "enum_appendices_blocks_callout_tone" DEFAULT 'note',
  	"title" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "appendices_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_appendices_blocks_cta_size" DEFAULT 'full',
  	"label" varchar,
  	"destination" "enum_appendices_blocks_cta_destination" DEFAULT 'programme',
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"appearance" "enum_appendices_blocks_cta_appearance" DEFAULT 'solid',
  	"block_name" varchar
  );
  
  CREATE TABLE "appendices_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_appendices_blocks_quote_size" DEFAULT 'full',
  	"quote" varchar,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "appendices_blocks_separator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_appendices_blocks_separator_size" DEFAULT 'full',
  	"style" "enum_appendices_blocks_separator_style" DEFAULT 'line',
  	"block_name" varchar
  );
  
  CREATE TABLE "_appendices_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__appendices_v_blocks_content_size" DEFAULT 'full',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_appendices_v_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"default_open" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_appendices_v_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__appendices_v_blocks_accordion_size" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_appendices_v_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__appendices_v_blocks_callout_size" DEFAULT 'full',
  	"tone" "enum__appendices_v_blocks_callout_tone" DEFAULT 'note',
  	"title" varchar,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_appendices_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__appendices_v_blocks_cta_size" DEFAULT 'full',
  	"label" varchar,
  	"destination" "enum__appendices_v_blocks_cta_destination" DEFAULT 'programme',
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"appearance" "enum__appendices_v_blocks_cta_appearance" DEFAULT 'solid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_appendices_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__appendices_v_blocks_quote_size" DEFAULT 'full',
  	"quote" varchar,
  	"attribution" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_appendices_v_blocks_separator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__appendices_v_blocks_separator_size" DEFAULT 'full',
  	"style" "enum__appendices_v_blocks_separator_style" DEFAULT 'line',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "appendices_blocks_content" ADD CONSTRAINT "appendices_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_blocks_accordion_items" ADD CONSTRAINT "appendices_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_blocks_accordion" ADD CONSTRAINT "appendices_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_blocks_callout" ADD CONSTRAINT "appendices_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_blocks_cta" ADD CONSTRAINT "appendices_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_blocks_quote" ADD CONSTRAINT "appendices_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_blocks_separator" ADD CONSTRAINT "appendices_blocks_separator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_content" ADD CONSTRAINT "_appendices_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_accordion_items" ADD CONSTRAINT "_appendices_v_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_accordion" ADD CONSTRAINT "_appendices_v_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_callout" ADD CONSTRAINT "_appendices_v_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_cta" ADD CONSTRAINT "_appendices_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_quote" ADD CONSTRAINT "_appendices_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_separator" ADD CONSTRAINT "_appendices_v_blocks_separator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "appendices_blocks_content_order_idx" ON "appendices_blocks_content" USING btree ("_order");
  CREATE INDEX "appendices_blocks_content_parent_id_idx" ON "appendices_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_content_path_idx" ON "appendices_blocks_content" USING btree ("_path");
  CREATE INDEX "appendices_blocks_accordion_items_order_idx" ON "appendices_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "appendices_blocks_accordion_items_parent_id_idx" ON "appendices_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_accordion_order_idx" ON "appendices_blocks_accordion" USING btree ("_order");
  CREATE INDEX "appendices_blocks_accordion_parent_id_idx" ON "appendices_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_accordion_path_idx" ON "appendices_blocks_accordion" USING btree ("_path");
  CREATE INDEX "appendices_blocks_callout_order_idx" ON "appendices_blocks_callout" USING btree ("_order");
  CREATE INDEX "appendices_blocks_callout_parent_id_idx" ON "appendices_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_callout_path_idx" ON "appendices_blocks_callout" USING btree ("_path");
  CREATE INDEX "appendices_blocks_cta_order_idx" ON "appendices_blocks_cta" USING btree ("_order");
  CREATE INDEX "appendices_blocks_cta_parent_id_idx" ON "appendices_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_cta_path_idx" ON "appendices_blocks_cta" USING btree ("_path");
  CREATE INDEX "appendices_blocks_quote_order_idx" ON "appendices_blocks_quote" USING btree ("_order");
  CREATE INDEX "appendices_blocks_quote_parent_id_idx" ON "appendices_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_quote_path_idx" ON "appendices_blocks_quote" USING btree ("_path");
  CREATE INDEX "appendices_blocks_separator_order_idx" ON "appendices_blocks_separator" USING btree ("_order");
  CREATE INDEX "appendices_blocks_separator_parent_id_idx" ON "appendices_blocks_separator" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_separator_path_idx" ON "appendices_blocks_separator" USING btree ("_path");
  CREATE INDEX "_appendices_v_blocks_content_order_idx" ON "_appendices_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_content_parent_id_idx" ON "_appendices_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_content_path_idx" ON "_appendices_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_appendices_v_blocks_accordion_items_order_idx" ON "_appendices_v_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_accordion_items_parent_id_idx" ON "_appendices_v_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_accordion_order_idx" ON "_appendices_v_blocks_accordion" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_accordion_parent_id_idx" ON "_appendices_v_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_accordion_path_idx" ON "_appendices_v_blocks_accordion" USING btree ("_path");
  CREATE INDEX "_appendices_v_blocks_callout_order_idx" ON "_appendices_v_blocks_callout" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_callout_parent_id_idx" ON "_appendices_v_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_callout_path_idx" ON "_appendices_v_blocks_callout" USING btree ("_path");
  CREATE INDEX "_appendices_v_blocks_cta_order_idx" ON "_appendices_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_cta_parent_id_idx" ON "_appendices_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_cta_path_idx" ON "_appendices_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_appendices_v_blocks_quote_order_idx" ON "_appendices_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_quote_parent_id_idx" ON "_appendices_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_quote_path_idx" ON "_appendices_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_appendices_v_blocks_separator_order_idx" ON "_appendices_v_blocks_separator" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_separator_parent_id_idx" ON "_appendices_v_blocks_separator" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_separator_path_idx" ON "_appendices_v_blocks_separator" USING btree ("_path");
  INSERT INTO "appendices_blocks_content" ("_order", "_parent_id", "_path", "id", "size", "content", "block_name")
  SELECT 1, "_parent_id", 'blocks.' || ("_order" - 1) || '.layout', gen_random_uuid()::varchar, 'full', "description", NULL
  FROM "appendices_blocks_basic_text"
  WHERE "description" IS NOT NULL;
  INSERT INTO "_appendices_v_blocks_content" ("_order", "_parent_id", "_path", "size", "content", "_uuid", "block_name")
  SELECT 1, "_parent_id", 'version.blocks.' || ("_order" - 1) || '.layout', 'full', "description", COALESCE("_uuid", gen_random_uuid()::varchar), NULL
  FROM "_appendices_v_blocks_basic_text"
  WHERE "description" IS NOT NULL;
  ALTER TABLE "appendices_blocks_basic_text" DROP COLUMN "description";
  ALTER TABLE "_appendices_v_blocks_basic_text" DROP COLUMN "description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "appendices_blocks_basic_text" ADD COLUMN "description" jsonb;
  ALTER TABLE "_appendices_v_blocks_basic_text" ADD COLUMN "description" jsonb;
  UPDATE "appendices_blocks_basic_text" AS bt
  SET "description" = c."content"
  FROM "appendices_blocks_content" AS c
  WHERE c."_parent_id" = bt."_parent_id"
  AND c."_path" = 'blocks.' || (bt."_order" - 1) || '.layout'
  AND c."_order" = 1;
  UPDATE "_appendices_v_blocks_basic_text" AS bt
  SET "description" = c."content"
  FROM "_appendices_v_blocks_content" AS c
  WHERE c."_parent_id" = bt."_parent_id"
  AND c."_path" = 'version.blocks.' || (bt."_order" - 1) || '.layout'
  AND c."_order" = 1;
  DROP TABLE "appendices_blocks_content" CASCADE;
  DROP TABLE "appendices_blocks_accordion_items" CASCADE;
  DROP TABLE "appendices_blocks_accordion" CASCADE;
  DROP TABLE "appendices_blocks_callout" CASCADE;
  DROP TABLE "appendices_blocks_cta" CASCADE;
  DROP TABLE "appendices_blocks_quote" CASCADE;
  DROP TABLE "appendices_blocks_separator" CASCADE;
  DROP TABLE "_appendices_v_blocks_content" CASCADE;
  DROP TABLE "_appendices_v_blocks_accordion_items" CASCADE;
  DROP TABLE "_appendices_v_blocks_accordion" CASCADE;
  DROP TABLE "_appendices_v_blocks_callout" CASCADE;
  DROP TABLE "_appendices_v_blocks_cta" CASCADE;
  DROP TABLE "_appendices_v_blocks_quote" CASCADE;
  DROP TABLE "_appendices_v_blocks_separator" CASCADE;
  DROP TYPE "public"."enum_appendices_blocks_content_size";
  DROP TYPE "public"."enum_appendices_blocks_accordion_size";
  DROP TYPE "public"."enum_appendices_blocks_callout_size";
  DROP TYPE "public"."enum_appendices_blocks_callout_tone";
  DROP TYPE "public"."enum_appendices_blocks_cta_size";
  DROP TYPE "public"."enum_appendices_blocks_cta_destination";
  DROP TYPE "public"."enum_appendices_blocks_cta_appearance";
  DROP TYPE "public"."enum_appendices_blocks_quote_size";
  DROP TYPE "public"."enum_appendices_blocks_separator_size";
  DROP TYPE "public"."enum_appendices_blocks_separator_style";
  DROP TYPE "public"."enum__appendices_v_blocks_content_size";
  DROP TYPE "public"."enum__appendices_v_blocks_accordion_size";
  DROP TYPE "public"."enum__appendices_v_blocks_callout_size";
  DROP TYPE "public"."enum__appendices_v_blocks_callout_tone";
  DROP TYPE "public"."enum__appendices_v_blocks_cta_size";
  DROP TYPE "public"."enum__appendices_v_blocks_cta_destination";
  DROP TYPE "public"."enum__appendices_v_blocks_cta_appearance";
  DROP TYPE "public"."enum__appendices_v_blocks_quote_size";
  DROP TYPE "public"."enum__appendices_v_blocks_separator_size";
  DROP TYPE "public"."enum__appendices_v_blocks_separator_style";`)
}
