import * as migration_20261004_102838_fcr_conference_cms from './20261004_102838_fcr_conference_cms';
import * as migration_20261004_111121_drop_people_institution_other from './20261004_111121_drop_people_institution_other';
import * as migration_20261004_113207_media_readonly_joins from './20261004_113207_media_readonly_joins';

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
    name: '20261004_113207_media_readonly_joins'
  },
];
