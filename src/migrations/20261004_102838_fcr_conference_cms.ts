import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_crop_focus" AS ENUM('center', 'top', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum_abstracts_authors_role" AS ENUM('primaryInvestigator', 'partner', 'collaborator', 'teamMember');
  CREATE TYPE "public"."enum_abstracts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__abstracts_v_version_authors_role" AS ENUM('primaryInvestigator', 'partner', 'collaborator', 'teamMember');
  CREATE TYPE "public"."enum__abstracts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_appendices_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__appendices_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_agenda_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__agenda_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_conference_days_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__conference_days_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_conferences_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__conferences_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" jsonb,
  	"abstract_id" integer,
  	"crop_focus" "enum_media_crop_focus" DEFAULT 'center',
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_full_url" varchar,
  	"sizes_full_width" numeric,
  	"sizes_full_height" numeric,
  	"sizes_full_mime_type" varchar,
  	"sizes_full_filesize" numeric,
  	"sizes_full_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "abstract_statuses_default_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "abstract_statuses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"status" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "abstracts_related_codes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"status_id" integer
  );
  
  CREATE TABLE "abstracts_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "abstracts_appendices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb
  );
  
  CREATE TABLE "abstracts_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"person_id" integer,
  	"role" "enum_abstracts_authors_role",
  	"is_speaker" boolean DEFAULT false
  );
  
  CREATE TABLE "abstracts_picture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"description" varchar
  );
  
  CREATE TABLE "abstracts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_abstracts_abstracts_order" varchar,
  	"_abstracts_childabstracts_order" varchar,
  	"_order" varchar,
  	"title" jsonb,
  	"code" varchar,
  	"status_id" integer,
  	"conference_id" integer,
  	"plain_title" varchar,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_abstracts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "abstracts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"agenda_items_id" integer
  );
  
  CREATE TABLE "_abstracts_v_version_related_codes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"status_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_abstracts_v_version_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_abstracts_v_version_appendices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_abstracts_v_version_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"person_id" integer,
  	"role" "enum__abstracts_v_version_authors_role",
  	"is_speaker" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_abstracts_v_version_picture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_abstracts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__abstracts_abstracts_order" varchar,
  	"version__abstracts_childabstracts_order" varchar,
  	"version__order" varchar,
  	"version_title" jsonb,
  	"version_code" varchar,
  	"version_status_id" integer,
  	"version_conference_id" integer,
  	"version_plain_title" varchar,
  	"version_note" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__abstracts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_abstracts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"agenda_items_id" integer
  );
  
  CREATE TABLE "appendices_blocks_basic_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "appendices_blocks_reviewers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "appendices_blocks_research_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "appendices_blocks_institutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "appendices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"conference_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_appendices_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "appendices_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"institutions_id" integer
  );
  
  CREATE TABLE "_appendices_v_blocks_basic_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_appendices_v_blocks_reviewers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_appendices_v_blocks_research_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_appendices_v_blocks_institutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_appendices_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_conference_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__appendices_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_appendices_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"institutions_id" integer
  );
  
  CREATE TABLE "agenda_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_agenda_items_agendaitems_order" varchar,
  	"_agenda_items_children_order" varchar,
  	"_order" varchar,
  	"name" jsonb,
  	"day_id" integer,
  	"start_time" timestamp(3) with time zone,
  	"end_time" timestamp(3) with time zone,
  	"is_keynote" boolean DEFAULT false,
  	"icon_provider" varchar,
  	"icon_name" varchar,
  	"description" jsonb,
  	"title" varchar,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_agenda_items_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_agenda_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__agenda_items_agendaitems_order" varchar,
  	"version__agenda_items_children_order" varchar,
  	"version__order" varchar,
  	"version_name" jsonb,
  	"version_day_id" integer,
  	"version_start_time" timestamp(3) with time zone,
  	"version_end_time" timestamp(3) with time zone,
  	"version_is_keynote" boolean DEFAULT false,
  	"version_icon_provider" varchar,
  	"version_icon_name" varchar,
  	"version_description" jsonb,
  	"version_title" varchar,
  	"version_parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__agenda_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "conference_days" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"start_time" timestamp(3) with time zone,
  	"end_time" timestamp(3) with time zone,
  	"conference_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_conference_days_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_conference_days_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_start_time" timestamp(3) with time zone,
  	"version_end_time" timestamp(3) with time zone,
  	"version_conference_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__conference_days_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "conferences_geo_key_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "conferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" jsonb,
  	"year" numeric,
  	"logo_id" integer,
  	"primary_color" varchar DEFAULT '#0f172a',
  	"secondary_color" varchar DEFAULT '#3b82f6',
  	"description" jsonb,
  	"city" varchar,
  	"country" varchar,
  	"address" varchar,
  	"longitude" numeric,
  	"latitude" numeric,
  	"location" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"geo_summary" varchar,
  	"geo_primary_entity" varchar,
  	"title" varchar,
  	"published_at" timestamp(3) with time zone,
  	"public_archive" boolean DEFAULT false,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_conferences_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_conferences_v_version_geo_key_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_conferences_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" jsonb,
  	"version_year" numeric,
  	"version_logo_id" integer,
  	"version_primary_color" varchar DEFAULT '#0f172a',
  	"version_secondary_color" varchar DEFAULT '#3b82f6',
  	"version_description" jsonb,
  	"version_city" varchar,
  	"version_country" varchar,
  	"version_address" varchar,
  	"version_longitude" numeric,
  	"version_latitude" numeric,
  	"version_location" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_geo_summary" varchar,
  	"version_geo_primary_entity" varchar,
  	"version_title" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_public_archive" boolean DEFAULT false,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__conferences_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "countries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "institutions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"country_id" integer NOT NULL,
  	"region_id" integer,
  	"description" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "italian_regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"institution_id" integer,
  	"institution_other" varchar,
  	"photo_id" integer,
  	"bio" jsonb,
  	"full_name" varchar,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"users_id" integer,
  	"abstract_statuses_id" integer,
  	"abstracts_id" integer,
  	"appendices_id" integer,
  	"agenda_items_id" integer,
  	"conference_days_id" integer,
  	"conferences_id" integer,
  	"countries_id" integer,
  	"institutions_id" integer,
  	"italian_regions_id" integer,
  	"people_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"structure_icon_provider" varchar NOT NULL,
  	"structure_icon_name" varchar,
  	"structure_label" varchar,
  	"structure_url" varchar,
  	"delegation_icon_provider" varchar NOT NULL,
  	"delegation_icon_name" varchar,
  	"delegation_label" varchar,
  	"delegation_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"conferences_id" integer
  );
  
  CREATE TABLE "active_conference" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"conference_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "conference_archive" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "media" ADD CONSTRAINT "media_abstract_id_abstracts_id_fk" FOREIGN KEY ("abstract_id") REFERENCES "public"."abstracts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "abstract_statuses_default_content" ADD CONSTRAINT "abstract_statuses_default_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."abstract_statuses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "abstracts_related_codes" ADD CONSTRAINT "abstracts_related_codes_status_id_abstract_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."abstract_statuses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "abstracts_related_codes" ADD CONSTRAINT "abstracts_related_codes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."abstracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "abstracts_content" ADD CONSTRAINT "abstracts_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."abstracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "abstracts_appendices" ADD CONSTRAINT "abstracts_appendices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."abstracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "abstracts_authors" ADD CONSTRAINT "abstracts_authors_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "abstracts_authors" ADD CONSTRAINT "abstracts_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."abstracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "abstracts_picture" ADD CONSTRAINT "abstracts_picture_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "abstracts_picture" ADD CONSTRAINT "abstracts_picture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."abstracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "abstracts" ADD CONSTRAINT "abstracts_status_id_abstract_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."abstract_statuses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "abstracts" ADD CONSTRAINT "abstracts_conference_id_conferences_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conferences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "abstracts_rels" ADD CONSTRAINT "abstracts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."abstracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "abstracts_rels" ADD CONSTRAINT "abstracts_rels_agenda_items_fk" FOREIGN KEY ("agenda_items_id") REFERENCES "public"."agenda_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_abstracts_v_version_related_codes" ADD CONSTRAINT "_abstracts_v_version_related_codes_status_id_abstract_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."abstract_statuses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_abstracts_v_version_related_codes" ADD CONSTRAINT "_abstracts_v_version_related_codes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_abstracts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_abstracts_v_version_content" ADD CONSTRAINT "_abstracts_v_version_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_abstracts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_abstracts_v_version_appendices" ADD CONSTRAINT "_abstracts_v_version_appendices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_abstracts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_abstracts_v_version_authors" ADD CONSTRAINT "_abstracts_v_version_authors_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_abstracts_v_version_authors" ADD CONSTRAINT "_abstracts_v_version_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_abstracts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_abstracts_v_version_picture" ADD CONSTRAINT "_abstracts_v_version_picture_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_abstracts_v_version_picture" ADD CONSTRAINT "_abstracts_v_version_picture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_abstracts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_abstracts_v" ADD CONSTRAINT "_abstracts_v_parent_id_abstracts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."abstracts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_abstracts_v" ADD CONSTRAINT "_abstracts_v_version_status_id_abstract_statuses_id_fk" FOREIGN KEY ("version_status_id") REFERENCES "public"."abstract_statuses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_abstracts_v" ADD CONSTRAINT "_abstracts_v_version_conference_id_conferences_id_fk" FOREIGN KEY ("version_conference_id") REFERENCES "public"."conferences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_abstracts_v_rels" ADD CONSTRAINT "_abstracts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_abstracts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_abstracts_v_rels" ADD CONSTRAINT "_abstracts_v_rels_agenda_items_fk" FOREIGN KEY ("agenda_items_id") REFERENCES "public"."agenda_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_blocks_basic_text" ADD CONSTRAINT "appendices_blocks_basic_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_blocks_reviewers" ADD CONSTRAINT "appendices_blocks_reviewers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_blocks_research_projects" ADD CONSTRAINT "appendices_blocks_research_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_blocks_institutions" ADD CONSTRAINT "appendices_blocks_institutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices" ADD CONSTRAINT "appendices_conference_id_conferences_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conferences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "appendices_rels" ADD CONSTRAINT "appendices_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "appendices_rels" ADD CONSTRAINT "appendices_rels_institutions_fk" FOREIGN KEY ("institutions_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_basic_text" ADD CONSTRAINT "_appendices_v_blocks_basic_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_reviewers" ADD CONSTRAINT "_appendices_v_blocks_reviewers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_research_projects" ADD CONSTRAINT "_appendices_v_blocks_research_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_blocks_institutions" ADD CONSTRAINT "_appendices_v_blocks_institutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_appendices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v" ADD CONSTRAINT "_appendices_v_parent_id_appendices_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."appendices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_appendices_v" ADD CONSTRAINT "_appendices_v_version_conference_id_conferences_id_fk" FOREIGN KEY ("version_conference_id") REFERENCES "public"."conferences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_appendices_v_rels" ADD CONSTRAINT "_appendices_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_appendices_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appendices_v_rels" ADD CONSTRAINT "_appendices_v_rels_institutions_fk" FOREIGN KEY ("institutions_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agenda_items" ADD CONSTRAINT "agenda_items_day_id_conference_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "public"."conference_days"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agenda_items" ADD CONSTRAINT "agenda_items_parent_id_agenda_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."agenda_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_agenda_items_v" ADD CONSTRAINT "_agenda_items_v_parent_id_agenda_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."agenda_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_agenda_items_v" ADD CONSTRAINT "_agenda_items_v_version_day_id_conference_days_id_fk" FOREIGN KEY ("version_day_id") REFERENCES "public"."conference_days"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_agenda_items_v" ADD CONSTRAINT "_agenda_items_v_version_parent_id_agenda_items_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."agenda_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conference_days" ADD CONSTRAINT "conference_days_conference_id_conferences_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conferences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_conference_days_v" ADD CONSTRAINT "_conference_days_v_parent_id_conference_days_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."conference_days"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_conference_days_v" ADD CONSTRAINT "_conference_days_v_version_conference_id_conferences_id_fk" FOREIGN KEY ("version_conference_id") REFERENCES "public"."conferences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conferences_geo_key_facts" ADD CONSTRAINT "conferences_geo_key_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conferences" ADD CONSTRAINT "conferences_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "conferences" ADD CONSTRAINT "conferences_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_conferences_v_version_geo_key_facts" ADD CONSTRAINT "_conferences_v_version_geo_key_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_conferences_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_conferences_v" ADD CONSTRAINT "_conferences_v_parent_id_conferences_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."conferences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_conferences_v" ADD CONSTRAINT "_conferences_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_conferences_v" ADD CONSTRAINT "_conferences_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "institutions" ADD CONSTRAINT "institutions_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "institutions" ADD CONSTRAINT "institutions_region_id_italian_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."italian_regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_abstract_statuses_fk" FOREIGN KEY ("abstract_statuses_id") REFERENCES "public"."abstract_statuses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_abstracts_fk" FOREIGN KEY ("abstracts_id") REFERENCES "public"."abstracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appendices_fk" FOREIGN KEY ("appendices_id") REFERENCES "public"."appendices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_agenda_items_fk" FOREIGN KEY ("agenda_items_id") REFERENCES "public"."agenda_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conference_days_fk" FOREIGN KEY ("conference_days_id") REFERENCES "public"."conference_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conferences_fk" FOREIGN KEY ("conferences_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_institutions_fk" FOREIGN KEY ("institutions_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_italian_regions_fk" FOREIGN KEY ("italian_regions_id") REFERENCES "public"."italian_regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_conferences_fk" FOREIGN KEY ("conferences_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "active_conference" ADD CONSTRAINT "active_conference_conference_id_conferences_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conferences"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_abstract_idx" ON "media" USING btree ("abstract_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_full_sizes_full_filename_idx" ON "media" USING btree ("sizes_full_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_people_id_idx" ON "media_rels" USING btree ("people_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "abstract_statuses_default_content_order_idx" ON "abstract_statuses_default_content" USING btree ("_order");
  CREATE INDEX "abstract_statuses_default_content_parent_id_idx" ON "abstract_statuses_default_content" USING btree ("_parent_id");
  CREATE INDEX "abstract_statuses__order_idx" ON "abstract_statuses" USING btree ("_order");
  CREATE UNIQUE INDEX "abstract_statuses_status_idx" ON "abstract_statuses" USING btree ("status");
  CREATE INDEX "abstract_statuses_updated_at_idx" ON "abstract_statuses" USING btree ("updated_at");
  CREATE INDEX "abstract_statuses_created_at_idx" ON "abstract_statuses" USING btree ("created_at");
  CREATE INDEX "abstracts_related_codes_order_idx" ON "abstracts_related_codes" USING btree ("_order");
  CREATE INDEX "abstracts_related_codes_parent_id_idx" ON "abstracts_related_codes" USING btree ("_parent_id");
  CREATE INDEX "abstracts_related_codes_status_idx" ON "abstracts_related_codes" USING btree ("status_id");
  CREATE INDEX "abstracts_content_order_idx" ON "abstracts_content" USING btree ("_order");
  CREATE INDEX "abstracts_content_parent_id_idx" ON "abstracts_content" USING btree ("_parent_id");
  CREATE INDEX "abstracts_appendices_order_idx" ON "abstracts_appendices" USING btree ("_order");
  CREATE INDEX "abstracts_appendices_parent_id_idx" ON "abstracts_appendices" USING btree ("_parent_id");
  CREATE INDEX "abstracts_authors_order_idx" ON "abstracts_authors" USING btree ("_order");
  CREATE INDEX "abstracts_authors_parent_id_idx" ON "abstracts_authors" USING btree ("_parent_id");
  CREATE INDEX "abstracts_authors_person_idx" ON "abstracts_authors" USING btree ("person_id");
  CREATE INDEX "abstracts_picture_order_idx" ON "abstracts_picture" USING btree ("_order");
  CREATE INDEX "abstracts_picture_parent_id_idx" ON "abstracts_picture" USING btree ("_parent_id");
  CREATE INDEX "abstracts_picture_image_idx" ON "abstracts_picture" USING btree ("image_id");
  CREATE INDEX "abstracts__abstracts_abstracts_order_idx" ON "abstracts" USING btree ("_abstracts_abstracts_order");
  CREATE INDEX "abstracts__abstracts_childabstracts_order_idx" ON "abstracts" USING btree ("_abstracts_childabstracts_order");
  CREATE INDEX "abstracts__order_idx" ON "abstracts" USING btree ("_order");
  CREATE INDEX "abstracts_status_idx" ON "abstracts" USING btree ("status_id");
  CREATE INDEX "abstracts_conference_idx" ON "abstracts" USING btree ("conference_id");
  CREATE INDEX "abstracts_updated_at_idx" ON "abstracts" USING btree ("updated_at");
  CREATE INDEX "abstracts_created_at_idx" ON "abstracts" USING btree ("created_at");
  CREATE INDEX "abstracts__status_idx" ON "abstracts" USING btree ("_status");
  CREATE INDEX "abstracts_rels_order_idx" ON "abstracts_rels" USING btree ("order");
  CREATE INDEX "abstracts_rels_parent_idx" ON "abstracts_rels" USING btree ("parent_id");
  CREATE INDEX "abstracts_rels_path_idx" ON "abstracts_rels" USING btree ("path");
  CREATE INDEX "abstracts_rels_agenda_items_id_idx" ON "abstracts_rels" USING btree ("agenda_items_id");
  CREATE INDEX "_abstracts_v_version_related_codes_order_idx" ON "_abstracts_v_version_related_codes" USING btree ("_order");
  CREATE INDEX "_abstracts_v_version_related_codes_parent_id_idx" ON "_abstracts_v_version_related_codes" USING btree ("_parent_id");
  CREATE INDEX "_abstracts_v_version_related_codes_status_idx" ON "_abstracts_v_version_related_codes" USING btree ("status_id");
  CREATE INDEX "_abstracts_v_version_content_order_idx" ON "_abstracts_v_version_content" USING btree ("_order");
  CREATE INDEX "_abstracts_v_version_content_parent_id_idx" ON "_abstracts_v_version_content" USING btree ("_parent_id");
  CREATE INDEX "_abstracts_v_version_appendices_order_idx" ON "_abstracts_v_version_appendices" USING btree ("_order");
  CREATE INDEX "_abstracts_v_version_appendices_parent_id_idx" ON "_abstracts_v_version_appendices" USING btree ("_parent_id");
  CREATE INDEX "_abstracts_v_version_authors_order_idx" ON "_abstracts_v_version_authors" USING btree ("_order");
  CREATE INDEX "_abstracts_v_version_authors_parent_id_idx" ON "_abstracts_v_version_authors" USING btree ("_parent_id");
  CREATE INDEX "_abstracts_v_version_authors_person_idx" ON "_abstracts_v_version_authors" USING btree ("person_id");
  CREATE INDEX "_abstracts_v_version_picture_order_idx" ON "_abstracts_v_version_picture" USING btree ("_order");
  CREATE INDEX "_abstracts_v_version_picture_parent_id_idx" ON "_abstracts_v_version_picture" USING btree ("_parent_id");
  CREATE INDEX "_abstracts_v_version_picture_image_idx" ON "_abstracts_v_version_picture" USING btree ("image_id");
  CREATE INDEX "_abstracts_v_parent_idx" ON "_abstracts_v" USING btree ("parent_id");
  CREATE INDEX "_abstracts_v_version_version__abstracts_abstracts_order_idx" ON "_abstracts_v" USING btree ("version__abstracts_abstracts_order");
  CREATE INDEX "_abstracts_v_version_version__abstracts_childabstracts_o_idx" ON "_abstracts_v" USING btree ("version__abstracts_childabstracts_order");
  CREATE INDEX "_abstracts_v_version_version__order_idx" ON "_abstracts_v" USING btree ("version__order");
  CREATE INDEX "_abstracts_v_version_version_status_idx" ON "_abstracts_v" USING btree ("version_status_id");
  CREATE INDEX "_abstracts_v_version_version_conference_idx" ON "_abstracts_v" USING btree ("version_conference_id");
  CREATE INDEX "_abstracts_v_version_version_updated_at_idx" ON "_abstracts_v" USING btree ("version_updated_at");
  CREATE INDEX "_abstracts_v_version_version_created_at_idx" ON "_abstracts_v" USING btree ("version_created_at");
  CREATE INDEX "_abstracts_v_version_version__status_idx" ON "_abstracts_v" USING btree ("version__status");
  CREATE INDEX "_abstracts_v_created_at_idx" ON "_abstracts_v" USING btree ("created_at");
  CREATE INDEX "_abstracts_v_updated_at_idx" ON "_abstracts_v" USING btree ("updated_at");
  CREATE INDEX "_abstracts_v_latest_idx" ON "_abstracts_v" USING btree ("latest");
  CREATE INDEX "_abstracts_v_autosave_idx" ON "_abstracts_v" USING btree ("autosave");
  CREATE INDEX "_abstracts_v_rels_order_idx" ON "_abstracts_v_rels" USING btree ("order");
  CREATE INDEX "_abstracts_v_rels_parent_idx" ON "_abstracts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_abstracts_v_rels_path_idx" ON "_abstracts_v_rels" USING btree ("path");
  CREATE INDEX "_abstracts_v_rels_agenda_items_id_idx" ON "_abstracts_v_rels" USING btree ("agenda_items_id");
  CREATE INDEX "appendices_blocks_basic_text_order_idx" ON "appendices_blocks_basic_text" USING btree ("_order");
  CREATE INDEX "appendices_blocks_basic_text_parent_id_idx" ON "appendices_blocks_basic_text" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_basic_text_path_idx" ON "appendices_blocks_basic_text" USING btree ("_path");
  CREATE INDEX "appendices_blocks_reviewers_order_idx" ON "appendices_blocks_reviewers" USING btree ("_order");
  CREATE INDEX "appendices_blocks_reviewers_parent_id_idx" ON "appendices_blocks_reviewers" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_reviewers_path_idx" ON "appendices_blocks_reviewers" USING btree ("_path");
  CREATE INDEX "appendices_blocks_research_projects_order_idx" ON "appendices_blocks_research_projects" USING btree ("_order");
  CREATE INDEX "appendices_blocks_research_projects_parent_id_idx" ON "appendices_blocks_research_projects" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_research_projects_path_idx" ON "appendices_blocks_research_projects" USING btree ("_path");
  CREATE INDEX "appendices_blocks_institutions_order_idx" ON "appendices_blocks_institutions" USING btree ("_order");
  CREATE INDEX "appendices_blocks_institutions_parent_id_idx" ON "appendices_blocks_institutions" USING btree ("_parent_id");
  CREATE INDEX "appendices_blocks_institutions_path_idx" ON "appendices_blocks_institutions" USING btree ("_path");
  CREATE UNIQUE INDEX "appendices_conference_idx" ON "appendices" USING btree ("conference_id");
  CREATE INDEX "appendices_updated_at_idx" ON "appendices" USING btree ("updated_at");
  CREATE INDEX "appendices_created_at_idx" ON "appendices" USING btree ("created_at");
  CREATE INDEX "appendices__status_idx" ON "appendices" USING btree ("_status");
  CREATE INDEX "appendices_rels_order_idx" ON "appendices_rels" USING btree ("order");
  CREATE INDEX "appendices_rels_parent_idx" ON "appendices_rels" USING btree ("parent_id");
  CREATE INDEX "appendices_rels_path_idx" ON "appendices_rels" USING btree ("path");
  CREATE INDEX "appendices_rels_institutions_id_idx" ON "appendices_rels" USING btree ("institutions_id");
  CREATE INDEX "_appendices_v_blocks_basic_text_order_idx" ON "_appendices_v_blocks_basic_text" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_basic_text_parent_id_idx" ON "_appendices_v_blocks_basic_text" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_basic_text_path_idx" ON "_appendices_v_blocks_basic_text" USING btree ("_path");
  CREATE INDEX "_appendices_v_blocks_reviewers_order_idx" ON "_appendices_v_blocks_reviewers" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_reviewers_parent_id_idx" ON "_appendices_v_blocks_reviewers" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_reviewers_path_idx" ON "_appendices_v_blocks_reviewers" USING btree ("_path");
  CREATE INDEX "_appendices_v_blocks_research_projects_order_idx" ON "_appendices_v_blocks_research_projects" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_research_projects_parent_id_idx" ON "_appendices_v_blocks_research_projects" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_research_projects_path_idx" ON "_appendices_v_blocks_research_projects" USING btree ("_path");
  CREATE INDEX "_appendices_v_blocks_institutions_order_idx" ON "_appendices_v_blocks_institutions" USING btree ("_order");
  CREATE INDEX "_appendices_v_blocks_institutions_parent_id_idx" ON "_appendices_v_blocks_institutions" USING btree ("_parent_id");
  CREATE INDEX "_appendices_v_blocks_institutions_path_idx" ON "_appendices_v_blocks_institutions" USING btree ("_path");
  CREATE INDEX "_appendices_v_parent_idx" ON "_appendices_v" USING btree ("parent_id");
  CREATE INDEX "_appendices_v_version_version_conference_idx" ON "_appendices_v" USING btree ("version_conference_id");
  CREATE INDEX "_appendices_v_version_version_updated_at_idx" ON "_appendices_v" USING btree ("version_updated_at");
  CREATE INDEX "_appendices_v_version_version_created_at_idx" ON "_appendices_v" USING btree ("version_created_at");
  CREATE INDEX "_appendices_v_version_version__status_idx" ON "_appendices_v" USING btree ("version__status");
  CREATE INDEX "_appendices_v_created_at_idx" ON "_appendices_v" USING btree ("created_at");
  CREATE INDEX "_appendices_v_updated_at_idx" ON "_appendices_v" USING btree ("updated_at");
  CREATE INDEX "_appendices_v_latest_idx" ON "_appendices_v" USING btree ("latest");
  CREATE INDEX "_appendices_v_autosave_idx" ON "_appendices_v" USING btree ("autosave");
  CREATE INDEX "_appendices_v_rels_order_idx" ON "_appendices_v_rels" USING btree ("order");
  CREATE INDEX "_appendices_v_rels_parent_idx" ON "_appendices_v_rels" USING btree ("parent_id");
  CREATE INDEX "_appendices_v_rels_path_idx" ON "_appendices_v_rels" USING btree ("path");
  CREATE INDEX "_appendices_v_rels_institutions_id_idx" ON "_appendices_v_rels" USING btree ("institutions_id");
  CREATE INDEX "agenda_items__agenda_items_agendaitems_order_idx" ON "agenda_items" USING btree ("_agenda_items_agendaitems_order");
  CREATE INDEX "agenda_items__agenda_items_children_order_idx" ON "agenda_items" USING btree ("_agenda_items_children_order");
  CREATE INDEX "agenda_items__order_idx" ON "agenda_items" USING btree ("_order");
  CREATE INDEX "agenda_items_day_idx" ON "agenda_items" USING btree ("day_id");
  CREATE INDEX "agenda_items_parent_idx" ON "agenda_items" USING btree ("parent_id");
  CREATE INDEX "agenda_items_updated_at_idx" ON "agenda_items" USING btree ("updated_at");
  CREATE INDEX "agenda_items_created_at_idx" ON "agenda_items" USING btree ("created_at");
  CREATE INDEX "agenda_items__status_idx" ON "agenda_items" USING btree ("_status");
  CREATE INDEX "_agenda_items_v_parent_idx" ON "_agenda_items_v" USING btree ("parent_id");
  CREATE INDEX "_agenda_items_v_version_version__agenda_items_agendaitem_idx" ON "_agenda_items_v" USING btree ("version__agenda_items_agendaitems_order");
  CREATE INDEX "_agenda_items_v_version_version__agenda_items_children_o_idx" ON "_agenda_items_v" USING btree ("version__agenda_items_children_order");
  CREATE INDEX "_agenda_items_v_version_version__order_idx" ON "_agenda_items_v" USING btree ("version__order");
  CREATE INDEX "_agenda_items_v_version_version_day_idx" ON "_agenda_items_v" USING btree ("version_day_id");
  CREATE INDEX "_agenda_items_v_version_version_parent_idx" ON "_agenda_items_v" USING btree ("version_parent_id");
  CREATE INDEX "_agenda_items_v_version_version_updated_at_idx" ON "_agenda_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_agenda_items_v_version_version_created_at_idx" ON "_agenda_items_v" USING btree ("version_created_at");
  CREATE INDEX "_agenda_items_v_version_version__status_idx" ON "_agenda_items_v" USING btree ("version__status");
  CREATE INDEX "_agenda_items_v_created_at_idx" ON "_agenda_items_v" USING btree ("created_at");
  CREATE INDEX "_agenda_items_v_updated_at_idx" ON "_agenda_items_v" USING btree ("updated_at");
  CREATE INDEX "_agenda_items_v_latest_idx" ON "_agenda_items_v" USING btree ("latest");
  CREATE INDEX "_agenda_items_v_autosave_idx" ON "_agenda_items_v" USING btree ("autosave");
  CREATE INDEX "conference_days_date_idx" ON "conference_days" USING btree ("date");
  CREATE INDEX "conference_days_conference_idx" ON "conference_days" USING btree ("conference_id");
  CREATE INDEX "conference_days_updated_at_idx" ON "conference_days" USING btree ("updated_at");
  CREATE INDEX "conference_days_created_at_idx" ON "conference_days" USING btree ("created_at");
  CREATE INDEX "conference_days__status_idx" ON "conference_days" USING btree ("_status");
  CREATE INDEX "_conference_days_v_parent_idx" ON "_conference_days_v" USING btree ("parent_id");
  CREATE INDEX "_conference_days_v_version_version_date_idx" ON "_conference_days_v" USING btree ("version_date");
  CREATE INDEX "_conference_days_v_version_version_conference_idx" ON "_conference_days_v" USING btree ("version_conference_id");
  CREATE INDEX "_conference_days_v_version_version_updated_at_idx" ON "_conference_days_v" USING btree ("version_updated_at");
  CREATE INDEX "_conference_days_v_version_version_created_at_idx" ON "_conference_days_v" USING btree ("version_created_at");
  CREATE INDEX "_conference_days_v_version_version__status_idx" ON "_conference_days_v" USING btree ("version__status");
  CREATE INDEX "_conference_days_v_created_at_idx" ON "_conference_days_v" USING btree ("created_at");
  CREATE INDEX "_conference_days_v_updated_at_idx" ON "_conference_days_v" USING btree ("updated_at");
  CREATE INDEX "_conference_days_v_latest_idx" ON "_conference_days_v" USING btree ("latest");
  CREATE INDEX "_conference_days_v_autosave_idx" ON "_conference_days_v" USING btree ("autosave");
  CREATE INDEX "conferences_geo_key_facts_order_idx" ON "conferences_geo_key_facts" USING btree ("_order");
  CREATE INDEX "conferences_geo_key_facts_parent_id_idx" ON "conferences_geo_key_facts" USING btree ("_parent_id");
  CREATE INDEX "conferences_logo_idx" ON "conferences" USING btree ("logo_id");
  CREATE INDEX "conferences_meta_meta_image_idx" ON "conferences" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "conferences_slug_idx" ON "conferences" USING btree ("slug");
  CREATE INDEX "conferences_updated_at_idx" ON "conferences" USING btree ("updated_at");
  CREATE INDEX "conferences_created_at_idx" ON "conferences" USING btree ("created_at");
  CREATE INDEX "conferences__status_idx" ON "conferences" USING btree ("_status");
  CREATE INDEX "_conferences_v_version_geo_key_facts_order_idx" ON "_conferences_v_version_geo_key_facts" USING btree ("_order");
  CREATE INDEX "_conferences_v_version_geo_key_facts_parent_id_idx" ON "_conferences_v_version_geo_key_facts" USING btree ("_parent_id");
  CREATE INDEX "_conferences_v_parent_idx" ON "_conferences_v" USING btree ("parent_id");
  CREATE INDEX "_conferences_v_version_version_logo_idx" ON "_conferences_v" USING btree ("version_logo_id");
  CREATE INDEX "_conferences_v_version_meta_version_meta_image_idx" ON "_conferences_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_conferences_v_version_version_slug_idx" ON "_conferences_v" USING btree ("version_slug");
  CREATE INDEX "_conferences_v_version_version_updated_at_idx" ON "_conferences_v" USING btree ("version_updated_at");
  CREATE INDEX "_conferences_v_version_version_created_at_idx" ON "_conferences_v" USING btree ("version_created_at");
  CREATE INDEX "_conferences_v_version_version__status_idx" ON "_conferences_v" USING btree ("version__status");
  CREATE INDEX "_conferences_v_created_at_idx" ON "_conferences_v" USING btree ("created_at");
  CREATE INDEX "_conferences_v_updated_at_idx" ON "_conferences_v" USING btree ("updated_at");
  CREATE INDEX "_conferences_v_latest_idx" ON "_conferences_v" USING btree ("latest");
  CREATE INDEX "_conferences_v_autosave_idx" ON "_conferences_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "countries_name_idx" ON "countries" USING btree ("name");
  CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
  CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
  CREATE INDEX "institutions__order_idx" ON "institutions" USING btree ("_order");
  CREATE INDEX "institutions_country_idx" ON "institutions" USING btree ("country_id");
  CREATE INDEX "institutions_region_idx" ON "institutions" USING btree ("region_id");
  CREATE INDEX "institutions_updated_at_idx" ON "institutions" USING btree ("updated_at");
  CREATE INDEX "institutions_created_at_idx" ON "institutions" USING btree ("created_at");
  CREATE UNIQUE INDEX "italian_regions_name_idx" ON "italian_regions" USING btree ("name");
  CREATE INDEX "italian_regions_updated_at_idx" ON "italian_regions" USING btree ("updated_at");
  CREATE INDEX "italian_regions_created_at_idx" ON "italian_regions" USING btree ("created_at");
  CREATE INDEX "people__order_idx" ON "people" USING btree ("_order");
  CREATE INDEX "people_institution_idx" ON "people" USING btree ("institution_id");
  CREATE INDEX "people_photo_idx" ON "people" USING btree ("photo_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_abstract_statuses_id_idx" ON "payload_locked_documents_rels" USING btree ("abstract_statuses_id");
  CREATE INDEX "payload_locked_documents_rels_abstracts_id_idx" ON "payload_locked_documents_rels" USING btree ("abstracts_id");
  CREATE INDEX "payload_locked_documents_rels_appendices_id_idx" ON "payload_locked_documents_rels" USING btree ("appendices_id");
  CREATE INDEX "payload_locked_documents_rels_agenda_items_id_idx" ON "payload_locked_documents_rels" USING btree ("agenda_items_id");
  CREATE INDEX "payload_locked_documents_rels_conference_days_id_idx" ON "payload_locked_documents_rels" USING btree ("conference_days_id");
  CREATE INDEX "payload_locked_documents_rels_conferences_id_idx" ON "payload_locked_documents_rels" USING btree ("conferences_id");
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
  CREATE INDEX "payload_locked_documents_rels_institutions_id_idx" ON "payload_locked_documents_rels" USING btree ("institutions_id");
  CREATE INDEX "payload_locked_documents_rels_italian_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("italian_regions_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_conferences_id_idx" ON "footer_rels" USING btree ("conferences_id");
  CREATE INDEX "active_conference_conference_idx" ON "active_conference" USING btree ("conference_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "media" CASCADE;
  DROP TABLE "media_rels" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "abstract_statuses_default_content" CASCADE;
  DROP TABLE "abstract_statuses" CASCADE;
  DROP TABLE "abstracts_related_codes" CASCADE;
  DROP TABLE "abstracts_content" CASCADE;
  DROP TABLE "abstracts_appendices" CASCADE;
  DROP TABLE "abstracts_authors" CASCADE;
  DROP TABLE "abstracts_picture" CASCADE;
  DROP TABLE "abstracts" CASCADE;
  DROP TABLE "abstracts_rels" CASCADE;
  DROP TABLE "_abstracts_v_version_related_codes" CASCADE;
  DROP TABLE "_abstracts_v_version_content" CASCADE;
  DROP TABLE "_abstracts_v_version_appendices" CASCADE;
  DROP TABLE "_abstracts_v_version_authors" CASCADE;
  DROP TABLE "_abstracts_v_version_picture" CASCADE;
  DROP TABLE "_abstracts_v" CASCADE;
  DROP TABLE "_abstracts_v_rels" CASCADE;
  DROP TABLE "appendices_blocks_basic_text" CASCADE;
  DROP TABLE "appendices_blocks_reviewers" CASCADE;
  DROP TABLE "appendices_blocks_research_projects" CASCADE;
  DROP TABLE "appendices_blocks_institutions" CASCADE;
  DROP TABLE "appendices" CASCADE;
  DROP TABLE "appendices_rels" CASCADE;
  DROP TABLE "_appendices_v_blocks_basic_text" CASCADE;
  DROP TABLE "_appendices_v_blocks_reviewers" CASCADE;
  DROP TABLE "_appendices_v_blocks_research_projects" CASCADE;
  DROP TABLE "_appendices_v_blocks_institutions" CASCADE;
  DROP TABLE "_appendices_v" CASCADE;
  DROP TABLE "_appendices_v_rels" CASCADE;
  DROP TABLE "agenda_items" CASCADE;
  DROP TABLE "_agenda_items_v" CASCADE;
  DROP TABLE "conference_days" CASCADE;
  DROP TABLE "_conference_days_v" CASCADE;
  DROP TABLE "conferences_geo_key_facts" CASCADE;
  DROP TABLE "conferences" CASCADE;
  DROP TABLE "_conferences_v_version_geo_key_facts" CASCADE;
  DROP TABLE "_conferences_v" CASCADE;
  DROP TABLE "countries" CASCADE;
  DROP TABLE "institutions" CASCADE;
  DROP TABLE "italian_regions" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "active_conference" CASCADE;
  DROP TABLE "conference_archive" CASCADE;
  DROP TYPE "public"."enum_media_crop_focus";
  DROP TYPE "public"."enum_abstracts_authors_role";
  DROP TYPE "public"."enum_abstracts_status";
  DROP TYPE "public"."enum__abstracts_v_version_authors_role";
  DROP TYPE "public"."enum__abstracts_v_version_status";
  DROP TYPE "public"."enum_appendices_status";
  DROP TYPE "public"."enum__appendices_v_version_status";
  DROP TYPE "public"."enum_agenda_items_status";
  DROP TYPE "public"."enum__agenda_items_v_version_status";
  DROP TYPE "public"."enum_conference_days_status";
  DROP TYPE "public"."enum__conference_days_v_version_status";
  DROP TYPE "public"."enum_conferences_status";
  DROP TYPE "public"."enum__conferences_v_version_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_footer_nav_items_link_type";`)
}
