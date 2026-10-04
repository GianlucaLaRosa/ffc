import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "appendices_blocks_basic_text" ADD COLUMN "icon_provider" varchar;
  ALTER TABLE "appendices_blocks_basic_text" ADD COLUMN "icon_name" varchar;
  ALTER TABLE "appendices_blocks_reviewers" ADD COLUMN "icon_provider" varchar;
  ALTER TABLE "appendices_blocks_reviewers" ADD COLUMN "icon_name" varchar;
  ALTER TABLE "appendices_blocks_research_projects" ADD COLUMN "icon_provider" varchar;
  ALTER TABLE "appendices_blocks_research_projects" ADD COLUMN "icon_name" varchar;
  ALTER TABLE "appendices_blocks_institutions" ADD COLUMN "icon_provider" varchar;
  ALTER TABLE "appendices_blocks_institutions" ADD COLUMN "icon_name" varchar;
  ALTER TABLE "_appendices_v_blocks_basic_text" ADD COLUMN "icon_provider" varchar;
  ALTER TABLE "_appendices_v_blocks_basic_text" ADD COLUMN "icon_name" varchar;
  ALTER TABLE "_appendices_v_blocks_reviewers" ADD COLUMN "icon_provider" varchar;
  ALTER TABLE "_appendices_v_blocks_reviewers" ADD COLUMN "icon_name" varchar;
  ALTER TABLE "_appendices_v_blocks_research_projects" ADD COLUMN "icon_provider" varchar;
  ALTER TABLE "_appendices_v_blocks_research_projects" ADD COLUMN "icon_name" varchar;
  ALTER TABLE "_appendices_v_blocks_institutions" ADD COLUMN "icon_provider" varchar;
  ALTER TABLE "_appendices_v_blocks_institutions" ADD COLUMN "icon_name" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "appendices_blocks_basic_text" DROP COLUMN "icon_provider";
  ALTER TABLE "appendices_blocks_basic_text" DROP COLUMN "icon_name";
  ALTER TABLE "appendices_blocks_reviewers" DROP COLUMN "icon_provider";
  ALTER TABLE "appendices_blocks_reviewers" DROP COLUMN "icon_name";
  ALTER TABLE "appendices_blocks_research_projects" DROP COLUMN "icon_provider";
  ALTER TABLE "appendices_blocks_research_projects" DROP COLUMN "icon_name";
  ALTER TABLE "appendices_blocks_institutions" DROP COLUMN "icon_provider";
  ALTER TABLE "appendices_blocks_institutions" DROP COLUMN "icon_name";
  ALTER TABLE "_appendices_v_blocks_basic_text" DROP COLUMN "icon_provider";
  ALTER TABLE "_appendices_v_blocks_basic_text" DROP COLUMN "icon_name";
  ALTER TABLE "_appendices_v_blocks_reviewers" DROP COLUMN "icon_provider";
  ALTER TABLE "_appendices_v_blocks_reviewers" DROP COLUMN "icon_name";
  ALTER TABLE "_appendices_v_blocks_research_projects" DROP COLUMN "icon_provider";
  ALTER TABLE "_appendices_v_blocks_research_projects" DROP COLUMN "icon_name";
  ALTER TABLE "_appendices_v_blocks_institutions" DROP COLUMN "icon_provider";
  ALTER TABLE "_appendices_v_blocks_institutions" DROP COLUMN "icon_name";`)
}
