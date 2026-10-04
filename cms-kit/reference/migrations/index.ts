import * as migration_20261003_180122_baseline from './20261003_180122_baseline';

export const migrations = [
  {
    up: migration_20261003_180122_baseline.up,
    down: migration_20261003_180122_baseline.down,
    name: '20261003_180122_baseline'
  },
];
