/**
 * Must be imported before `@payload-config` so DATABASE_URI from `.env` is applied.
 * Static imports in `index.ts` are hoisted; this side-effect module runs first.
 */
import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
loadEnv({ path: path.resolve(dirname, '../../.env') })
