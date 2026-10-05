import * as migration_20261004_102838_fcr_conference_cms from './20261004_102838_fcr_conference_cms';
import * as migration_20261004_111121_drop_people_institution_other from './20261004_111121_drop_people_institution_other';
import * as migration_20261004_113207_media_readonly_joins from './20261004_113207_media_readonly_joins';
import * as migration_20261004_165119_conference_intro_columns from './20261004_165119_conference_intro_columns';
import * as migration_20261004_165930_intro_accordion_blocks from './20261004_165930_intro_accordion_blocks';
import * as migration_20261004_170429_intro_layout_blocks from './20261004_170429_intro_layout_blocks';
import * as migration_20261004_170943_appendix_basic_text_layout from './20261004_170943_appendix_basic_text_layout';
import * as migration_20261004_172304_appendix_tab_icons from './20261004_172304_appendix_tab_icons';
import * as migration_20261004_194800_content_columns_array from './20261004_194800_content_columns_array';
import * as migration_20261004_202400_programme_push_subscriptions from './20261004_202400_programme_push_subscriptions';
import * as migration_20261004_204800_programme_alerts from './20261004_204800_programme_alerts';
import * as migration_20261004_212500_drop_footer_nav_items from './20261004_212500_drop_footer_nav_items';
import * as migration_20261005_001200_conference_notices from './20261005_001200_conference_notices';
import * as migration_20261005_001500_fix_notices_order_column from './20261005_001500_fix_notices_order_column';
import * as migration_20261005_151000_enable_public_archive from './20261005_151000_enable_public_archive';
import * as migration_20261005_153000_footer_policies from './20261005_153000_footer_policies';
import * as migration_20261005_170400_footer_partners_credits from './20261005_170400_footer_partners_credits';

export const migrations = [
  {
    up: migration_20261004_102838_fcr_conference_cms.up,
    down: migration_20261004_102838_fcr_conference_cms.down,
    name: '20261004_102838_fcr_conference_cms',
  },
  {
    up: migration_20261004_111121_drop_people_institution_other.up,
    down: migration_20261004_111121_drop_people_institution_other.down,
    name: '20261004_111121_drop_people_institution_other',
  },
  {
    up: migration_20261004_113207_media_readonly_joins.up,
    down: migration_20261004_113207_media_readonly_joins.down,
    name: '20261004_113207_media_readonly_joins',
  },
  {
    up: migration_20261004_165119_conference_intro_columns.up,
    down: migration_20261004_165119_conference_intro_columns.down,
    name: '20261004_165119_conference_intro_columns',
  },
  {
    up: migration_20261004_165930_intro_accordion_blocks.up,
    down: migration_20261004_165930_intro_accordion_blocks.down,
    name: '20261004_165930_intro_accordion_blocks',
  },
  {
    up: migration_20261004_170429_intro_layout_blocks.up,
    down: migration_20261004_170429_intro_layout_blocks.down,
    name: '20261004_170429_intro_layout_blocks',
  },
  {
    up: migration_20261004_170943_appendix_basic_text_layout.up,
    down: migration_20261004_170943_appendix_basic_text_layout.down,
    name: '20261004_170943_appendix_basic_text_layout',
  },
  {
    up: migration_20261004_172304_appendix_tab_icons.up,
    down: migration_20261004_172304_appendix_tab_icons.down,
    name: '20261004_172304_appendix_tab_icons',
  },
  {
    up: migration_20261004_194800_content_columns_array.up,
    down: migration_20261004_194800_content_columns_array.down,
    name: '20261004_194800_content_columns_array',
  },
  {
    up: migration_20261004_202400_programme_push_subscriptions.up,
    down: migration_20261004_202400_programme_push_subscriptions.down,
    name: '20261004_202400_programme_push_subscriptions',
  },
  {
    up: migration_20261004_204800_programme_alerts.up,
    down: migration_20261004_204800_programme_alerts.down,
    name: '20261004_204800_programme_alerts',
  },
  {
    up: migration_20261004_212500_drop_footer_nav_items.up,
    down: migration_20261004_212500_drop_footer_nav_items.down,
    name: '20261004_212500_drop_footer_nav_items',
  },
  {
    up: migration_20261005_001200_conference_notices.up,
    down: migration_20261005_001200_conference_notices.down,
    name: '20261005_001200_conference_notices',
  },
  {
    up: migration_20261005_001500_fix_notices_order_column.up,
    down: migration_20261005_001500_fix_notices_order_column.down,
    name: '20261005_001500_fix_notices_order_column',
  },
  {
    up: migration_20261005_151000_enable_public_archive.up,
    down: migration_20261005_151000_enable_public_archive.down,
    name: '20261005_151000_enable_public_archive',
  },
  {
    up: migration_20261005_153000_footer_policies.up,
    down: migration_20261005_153000_footer_policies.down,
    name: '20261005_153000_footer_policies',
  },
  {
    up: migration_20261005_170400_footer_partners_credits.up,
    down: migration_20261005_170400_footer_partners_credits.down,
    name: '20261005_170400_footer_partners_credits',
  },
];
