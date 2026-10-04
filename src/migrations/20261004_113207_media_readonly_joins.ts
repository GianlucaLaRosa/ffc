import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_rels" CASCADE;
  ALTER TABLE "media" DROP CONSTRAINT "media_abstract_id_abstracts_id_fk";
  
  DROP INDEX "media_abstract_idx";
  ALTER TABLE "media" DROP COLUMN "abstract_id";
  ALTER TABLE "media" DROP COLUMN "crop_focus";
  DROP TYPE "public"."enum_media_crop_focus";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_crop_focus" AS ENUM('center', 'top', 'bottom', 'left', 'right');
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer
  );
  
  ALTER TABLE "media" ADD COLUMN "abstract_id" integer;
  ALTER TABLE "media" ADD COLUMN "crop_focus" "enum_media_crop_focus" DEFAULT 'center';
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_people_id_idx" ON "media_rels" USING btree ("people_id");
  ALTER TABLE "media" ADD CONSTRAINT "media_abstract_id_abstracts_id_fk" FOREIGN KEY ("abstract_id") REFERENCES "public"."abstracts"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_abstract_idx" ON "media" USING btree ("abstract_id");`)
}
