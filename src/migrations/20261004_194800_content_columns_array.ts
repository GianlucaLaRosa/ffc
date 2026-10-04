import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_conferences_blocks_content_columns_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__conferences_v_blocks_content_columns_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_appendices_blocks_content_columns_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__appendices_v_blocks_content_columns_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');

  CREATE TABLE "conferences_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_conferences_blocks_content_columns_size" DEFAULT 'full',
  	"content" jsonb
  );

  CREATE TABLE "_conferences_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__conferences_v_blocks_content_columns_size" DEFAULT 'full',
  	"content" jsonb,
  	"_uuid" varchar
  );

  CREATE TABLE "appendices_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_appendices_blocks_content_columns_size" DEFAULT 'full',
  	"content" jsonb
  );

  CREATE TABLE "_appendices_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__appendices_v_blocks_content_columns_size" DEFAULT 'full',
  	"content" jsonb,
  	"_uuid" varchar
  );

  INSERT INTO "conferences_blocks_content_columns" ("_order", "_parent_id", "id", "size", "content")
  SELECT 1, "id", gen_random_uuid()::varchar, "size"::text::"enum_conferences_blocks_content_columns_size", "content"
  FROM "conferences_blocks_content";

  INSERT INTO "_conferences_v_blocks_content_columns" ("_order", "_parent_id", "size", "content", "_uuid")
  SELECT 1, "id", "size"::text::"enum__conferences_v_blocks_content_columns_size", "content", gen_random_uuid()::varchar
  FROM "_conferences_v_blocks_content";

  INSERT INTO "appendices_blocks_content_columns" ("_order", "_parent_id", "id", "size", "content")
  SELECT 1, "id", gen_random_uuid()::varchar, "size"::text::"enum_appendices_blocks_content_columns_size", "content"
  FROM "appendices_blocks_content";

  INSERT INTO "_appendices_v_blocks_content_columns" ("_order", "_parent_id", "size", "content", "_uuid")
  SELECT 1, "id", "size"::text::"enum__appendices_v_blocks_content_columns_size", "content", gen_random_uuid()::varchar
  FROM "_appendices_v_blocks_content";

  ALTER TABLE "conferences_blocks_content" DROP COLUMN "size";
  ALTER TABLE "conferences_blocks_content" DROP COLUMN "content";
  ALTER TABLE "_conferences_v_blocks_content" DROP COLUMN "size";
  ALTER TABLE "_conferences_v_blocks_content" DROP COLUMN "content";
  ALTER TABLE "appendices_blocks_content" DROP COLUMN "size";
  ALTER TABLE "appendices_blocks_content" DROP COLUMN "content";
  ALTER TABLE "_appendices_v_blocks_content" DROP COLUMN "size";
  ALTER TABLE "_appendices_v_blocks_content" DROP COLUMN "content";

  ALTER TABLE "conferences_blocks_content_columns" ADD CONSTRAINT "conferences_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_conferences_v_blocks_content_columns" ADD CONSTRAINT "_conferences_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_conferences_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_blocks_content_columns" ADD CONSTRAINT "appendices_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_content_columns" ADD CONSTRAINT "_appendices_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "conferences_blocks_content_columns_order_idx" ON "conferences_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "conferences_blocks_content_columns_parent_id_idx" ON "conferences_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_conferences_v_blocks_content_columns_order_idx" ON "_conferences_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_conferences_v_blocks_content_columns_parent_id_idx" ON "_conferences_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_content_columns_order_idx" ON "appendices_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "appendices_blocks_content_columns_parent_id_idx" ON "appendices_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_content_columns_order_idx" ON "_appendices_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_content_columns_parent_id_idx" ON "_appendices_v_blocks_content_columns" USING btree ("_parent_id");

  DROP TYPE "public"."enum_conferences_blocks_content_size";
  DROP TYPE "public"."enum__conferences_v_blocks_content_size";
  DROP TYPE "public"."enum_appendices_blocks_content_size";
  DROP TYPE "public"."enum__appendices_v_blocks_content_size";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_conferences_blocks_content_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__conferences_v_blocks_content_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum_appendices_blocks_content_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');
  CREATE TYPE "public"."enum__appendices_v_blocks_content_size" AS ENUM('full', 'twoThirds', 'half', 'oneThird');

  ALTER TABLE "conferences_blocks_content" ADD COLUMN "size" "enum_conferences_blocks_content_size" DEFAULT 'full';
  ALTER TABLE "conferences_blocks_content" ADD COLUMN "content" jsonb;
  ALTER TABLE "_conferences_v_blocks_content" ADD COLUMN "size" "enum__conferences_v_blocks_content_size" DEFAULT 'full';
  ALTER TABLE "_conferences_v_blocks_content" ADD COLUMN "content" jsonb;
  ALTER TABLE "appendices_blocks_content" ADD COLUMN "size" "enum_appendices_blocks_content_size" DEFAULT 'full';
  ALTER TABLE "appendices_blocks_content" ADD COLUMN "content" jsonb;
  ALTER TABLE "_appendices_v_blocks_content" ADD COLUMN "size" "enum__appendices_v_blocks_content_size" DEFAULT 'full';
  ALTER TABLE "_appendices_v_blocks_content" ADD COLUMN "content" jsonb;

  UPDATE "conferences_blocks_content" AS parent
  SET "size" = cols."size"::text::"enum_conferences_blocks_content_size", "content" = cols."content"
  FROM "conferences_blocks_content_columns" AS cols
  WHERE cols."_parent_id" = parent."id" AND cols."_order" = 1;

  UPDATE "_conferences_v_blocks_content" AS parent
  SET "size" = cols."size"::text::"enum__conferences_v_blocks_content_size", "content" = cols."content"
  FROM "_conferences_v_blocks_content_columns" AS cols
  WHERE cols."_parent_id" = parent."id" AND cols."_order" = 1;

  UPDATE "appendices_blocks_content" AS parent
  SET "size" = cols."size"::text::"enum_appendices_blocks_content_size", "content" = cols."content"
  FROM "appendices_blocks_content_columns" AS cols
  WHERE cols."_parent_id" = parent."id" AND cols."_order" = 1;

  UPDATE "_appendices_v_blocks_content" AS parent
  SET "size" = cols."size"::text::"enum__appendices_v_blocks_content_size", "content" = cols."content"
  FROM "_appendices_v_blocks_content_columns" AS cols
  WHERE cols."_parent_id" = parent."id" AND cols."_order" = 1;

  DROP TABLE "conferences_blocks_content_columns" CASCADE;
  DROP TABLE "_conferences_v_blocks_content_columns" CASCADE;
  DROP TABLE "appendices_blocks_content_columns" CASCADE;
  DROP TABLE "_appendices_v_blocks_content_columns" CASCADE;

  DROP TYPE "public"."enum_conferences_blocks_content_columns_size";
  DROP TYPE "public"."enum__conferences_v_blocks_content_columns_size";
  DROP TYPE "public"."enum_appendices_blocks_content_columns_size";
  DROP TYPE "public"."enum__appendices_v_blocks_content_columns_size";`)
}
