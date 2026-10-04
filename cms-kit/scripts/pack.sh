#!/usr/bin/env bash
# Refresh cms-kit/overlay from this repo's src. Run from repo root:
#   bash cms-kit/scripts/pack.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OVERLAY="$ROOT/cms-kit/overlay"
REF="$ROOT/cms-kit/reference"

rm -rf "$OVERLAY" "$REF"
mkdir -p "$OVERLAY" "$REF"

copy_tree() {
  local src="$1"
  local dest="$2"
  mkdir -p "$(dirname "$dest")"
  cp -R "$src" "$dest"
}

copy_file() {
  local src="$1"
  local dest="$2"
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
}

# Collections, fields, access, admin UI, globals, plugins, seed
copy_tree "$ROOT/src/collections" "$OVERLAY/src/collections"
copy_tree "$ROOT/src/fields" "$OVERLAY/src/fields"
copy_tree "$ROOT/src/access" "$OVERLAY/src/access"
copy_tree "$ROOT/src/components/admin" "$OVERLAY/src/components/admin"
copy_tree "$ROOT/src/components/BeforeLogin" "$OVERLAY/src/components/BeforeLogin"
copy_tree "$ROOT/src/ActiveConference" "$OVERLAY/src/ActiveConference"
copy_tree "$ROOT/src/ConferenceArchive" "$OVERLAY/src/ConferenceArchive"
copy_tree "$ROOT/src/plugins" "$OVERLAY/src/plugins"
copy_tree "$ROOT/.cursor/rules" "$OVERLAY/.cursor/rules"

mkdir -p "$OVERLAY/src/Footer/hooks"
copy_file "$ROOT/src/Footer/config.ts" "$OVERLAY/src/Footer/config.ts"
copy_file "$ROOT/src/Footer/hooks/revalidateFooter.ts" "$OVERLAY/src/Footer/hooks/revalidateFooter.ts"

mkdir -p "$OVERLAY/src/blocks/MediaBlock"
copy_file "$ROOT/src/blocks/MediaBlock/config.ts" "$OVERLAY/src/blocks/MediaBlock/config.ts"

copy_file "$ROOT/src/hooks/populatePublishedAt.ts" "$OVERLAY/src/hooks/populatePublishedAt.ts"

mkdir -p "$OVERLAY/src/utilities" "$OVERLAY/src/seed/data"
copy_file "$ROOT/src/utilities/mediaFolder.ts" "$OVERLAY/src/utilities/mediaFolder.ts"
copy_file "$ROOT/src/utilities/appendixInstitutions.ts" "$OVERLAY/src/utilities/appendixInstitutions.ts"
copy_file "$ROOT/src/utilities/seedAbstractStatuses.ts" "$OVERLAY/src/utilities/seedAbstractStatuses.ts"
copy_file "$ROOT/src/utilities/seedCountries.ts" "$OVERLAY/src/utilities/seedCountries.ts"
copy_file "$ROOT/src/utilities/seedItalianRegions.ts" "$OVERLAY/src/utilities/seedItalianRegions.ts"
copy_file "$ROOT/src/utilities/deepMerge.ts" "$OVERLAY/src/utilities/deepMerge.ts"
copy_file "$ROOT/src/utilities/ui.ts" "$OVERLAY/src/utilities/ui.ts"
copy_file "$ROOT/src/utilities/getURL.ts" "$OVERLAY/src/utilities/getURL.ts"
copy_file "$ROOT/src/utilities/canUseDOM.ts" "$OVERLAY/src/utilities/canUseDOM.ts"
copy_file "$ROOT/src/seed/data/countries.ts" "$OVERLAY/src/seed/data/countries.ts"
copy_file "$ROOT/src/seed/data/italianRegions.ts" "$OVERLAY/src/seed/data/italianRegions.ts"

# Full FCR payload config: merge into the target, do not blindly overwrite
copy_file "$ROOT/src/payload.config.ts" "$REF/payload.config.fcr.ts"

# Baseline schema for empty DBs only — never apply on an existing Payload/Neon DB
mkdir -p "$REF/migrations"
copy_file "$ROOT/src/migrations/20261003_180122_baseline.ts" "$REF/migrations/20261003_180122_baseline.ts"
copy_file "$ROOT/src/migrations/20261003_180122_baseline.json" "$REF/migrations/20261003_180122_baseline.json"
copy_file "$ROOT/src/migrations/index.ts" "$REF/migrations/index.ts"

# Payload App Router routes: copy only if the target is missing them
mkdir -p "$REF/app-payload"
cp -R "$ROOT/src/app/(payload)/." "$REF/app-payload/"
# Generated import map is target-specific
rm -f "$REF/app-payload/admin/importMap.js"

# Frontend-only files intentionally omitted:
#   src/Footer/Component.tsx, src/Footer/LucideIcon.tsx
#   src/blocks/MediaBlock/Component.tsx
#   public site pages, payload-types.ts, importMap.js

echo "Packed overlay -> $OVERLAY"
echo "Packed reference -> $REF"
find "$OVERLAY" -type f | wc -l | awk '{print "overlay files:", $1}'
