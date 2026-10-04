import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_conferences_blocks_callout_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_conferences_blocks_callout_tone" AS ENUM('note', 'important', 'deadline');
  CREATE TYPE "public"."enum_conferences_blocks_cta_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_conferences_blocks_cta_destination" AS ENUM('programme', 'venue', 'appendix', 'custom');
  CREATE TYPE "public"."enum_conferences_blocks_cta_appearance" AS ENUM('solid', 'outline');
  CREATE TYPE "public"."enum_conferences_blocks_quote_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_conferences_blocks_separator_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_conferences_blocks_separator_style" AS ENUM('line', 'space');
  CREATE TYPE "public"."enum__conferences_v_blocks_callout_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__conferences_v_blocks_callout_tone" AS ENUM('note', 'important', 'deadline');
  CREATE TYPE "public"."enum__conferences_v_blocks_cta_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__conferences_v_blocks_cta_destination" AS ENUM('programme', 'venue', 'appendix', 'custom');
  CREATE TYPE "public"."enum__conferences_v_blocks_cta_appearance" AS ENUM('solid', 'outline');
  CREATE TYPE "public"."enum__conferences_v_blocks_quote_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__conferences_v_blocks_separator_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__conferences_v_blocks_separator_style" AS ENUM('line', 'space');
  CREATE TABLE "conferences_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_conferences_blocks_callout_size" DEFAULT 'full',
  	"tone" "enum_conferences_blocks_callout_tone" DEFAULT 'note',
  	"title" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "conferences_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_conferences_blocks_cta_size" DEFAULT 'full',
  	"label" varchar,
  	"destination" "enum_conferences_blocks_cta_destination" DEFAULT 'programme',
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"appearance" "enum_conferences_blocks_cta_appearance" DEFAULT 'solid',
  	"block_name" varchar
  );
  
  CREATE TABLE "conferences_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_conferences_blocks_quote_size" DEFAULT 'full',
  	"quote" varchar,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "conferences_blocks_separator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_conferences_blocks_separator_size" DEFAULT 'full',
  	"style" "enum_conferences_blocks_separator_style" DEFAULT 'line',
  	"block_name" varchar
  );
  
  CREATE TABLE "_conferences_v_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__conferences_v_blocks_callout_size" DEFAULT 'full',
  	"tone" "enum__conferences_v_blocks_callout_tone" DEFAULT 'note',
  	"title" varchar,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_conferences_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__conferences_v_blocks_cta_size" DEFAULT 'full',
  	"label" varchar,
  	"destination" "enum__conferences_v_blocks_cta_destination" DEFAULT 'programme',
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"appearance" "enum__conferences_v_blocks_cta_appearance" DEFAULT 'solid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_conferences_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__conferences_v_blocks_quote_size" DEFAULT 'full',
  	"quote" varchar,
  	"attribution" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_conferences_v_blocks_separator" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__conferences_v_blocks_separator_size" DEFAULT 'full',
  	"style" "enum__conferences_v_blocks_separator_style" DEFAULT 'line',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "conferences_blocks_callout" ADD CONSTRAINT "conferences_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conferences_blocks_cta" ADD CONSTRAINT "conferences_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conferences_blocks_quote" ADD CONSTRAINT "conferences_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conferences_blocks_separator" ADD CONSTRAINT "conferences_blocks_separator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_conferences_v_blocks_callout" ADD CONSTRAINT "_conferences_v_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_conferences_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_conferences_v_blocks_cta" ADD CONSTRAINT "_conferences_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_conferences_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_conferences_v_blocks_quote" ADD CONSTRAINT "_conferences_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_conferences_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_conferences_v_blocks_separator" ADD CONSTRAINT "_conferences_v_blocks_separator_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_conferences_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "conferences_blocks_callout_order_idx" ON "conferences_blocks_callout" USING btree ("_order");
  CREATE INDEX "conferences_blocks_callout_parent_id_idx" ON "conferences_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "conferences_blocks_callout_path_idx" ON "conferences_blocks_callout" USING btree ("_path");
  CREATE INDEX "conferences_blocks_cta_order_idx" ON "conferences_blocks_cta" USING btree ("_order");
  CREATE INDEX "conferences_blocks_cta_parent_id_idx" ON "conferences_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "conferences_blocks_cta_path_idx" ON "conferences_blocks_cta" USING btree ("_path");
  CREATE INDEX "conferences_blocks_quote_order_idx" ON "conferences_blocks_quote" USING btree ("_order");
  CREATE INDEX "conferences_blocks_quote_parent_id_idx" ON "conferences_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "conferences_blocks_quote_path_idx" ON "conferences_blocks_quote" USING btree ("_path");
  CREATE INDEX "conferences_blocks_separator_order_idx" ON "conferences_blocks_separator" USING btree ("_order");
  CREATE INDEX "conferences_blocks_separator_parent_id_idx" ON "conferences_blocks_separator" USING btree ("_parent_id");
  CREATE INDEX "conferences_blocks_separator_path_idx" ON "conferences_blocks_separator" USING btree ("_path");
  CREATE INDEX "_conferences_v_blocks_callout_order_idx" ON "_conferences_v_blocks_callout" USING btree ("_order");
  CREATE INDEX "_conferences_v_blocks_callout_parent_id_idx" ON "_conferences_v_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "_conferences_v_blocks_callout_path_idx" ON "_conferences_v_blocks_callout" USING btree ("_path");
  CREATE INDEX "_conferences_v_blocks_cta_order_idx" ON "_conferences_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_conferences_v_blocks_cta_parent_id_idx" ON "_conferences_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_conferences_v_blocks_cta_path_idx" ON "_conferences_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_conferences_v_blocks_quote_order_idx" ON "_conferences_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_conferences_v_blocks_quote_parent_id_idx" ON "_conferences_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_conferences_v_blocks_quote_path_idx" ON "_conferences_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_conferences_v_blocks_separator_order_idx" ON "_conferences_v_blocks_separator" USING btree ("_order");
  CREATE INDEX "_conferences_v_blocks_separator_parent_id_idx" ON "_conferences_v_blocks_separator" USING btree ("_parent_id");
  CREATE INDEX "_conferences_v_blocks_separator_path_idx" ON "_conferences_v_blocks_separator" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "conferences_blocks_callout" CASCADE;
  DROP TABLE "conferences_blocks_cta" CASCADE;
  DROP TABLE "conferences_blocks_quote" CASCADE;
  DROP TABLE "conferences_blocks_separator" CASCADE;
  DROP TABLE "_conferences_v_blocks_callout" CASCADE;
  DROP TABLE "_conferences_v_blocks_cta" CASCADE;
  DROP TABLE "_conferences_v_blocks_quote" CASCADE;
  DROP TABLE "_conferences_v_blocks_separator" CASCADE;
  DROP TYPE "public"."enum_conferences_blocks_callout_size";
  DROP TYPE "public"."enum_conferences_blocks_callout_tone";
  DROP TYPE "public"."enum_conferences_blocks_cta_size";
  DROP TYPE "public"."enum_conferences_blocks_cta_destination";
  DROP TYPE "public"."enum_conferences_blocks_cta_appearance";
  DROP TYPE "public"."enum_conferences_blocks_quote_size";
  DROP TYPE "public"."enum_conferences_blocks_separator_size";
  DROP TYPE "public"."enum_conferences_blocks_separator_style";
  DROP TYPE "public"."enum__conferences_v_blocks_callout_size";
  DROP TYPE "public"."enum__conferences_v_blocks_callout_tone";
  DROP TYPE "public"."enum__conferences_v_blocks_cta_size";
  DROP TYPE "public"."enum__conferences_v_blocks_cta_destination";
  DROP TYPE "public"."enum__conferences_v_blocks_cta_appearance";
  DROP TYPE "public"."enum__conferences_v_blocks_quote_size";
  DROP TYPE "public"."enum__conferences_v_blocks_separator_size";
  DROP TYPE "public"."enum__conferences_v_blocks_separator_style";`)
}
