import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Days } from './collections/Days'
import { AgendaItems } from './collections/AgendaItems'
import { Abstracts } from './collections/Abstracts'
import { AbstractStatuses } from './collections/AbstractStatuses'
import { AbstractContents } from './collections/AbstractContents'
import { People } from './collections/People'
import { Institutions } from './collections/Institutions'
import { Countries } from './collections/Countries'
import { ItalianRegions } from './collections/ItalianRegions'
import { Conferences } from './collections/Conferences'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Conferences,
    Days,
    AgendaItems,
    Abstracts,
    AbstractStatuses,
    AbstractContents,
    People,
    Institutions,
    Countries,
    ItalianRegions,
    Media,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-at-least-32-characters-long',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://postgres:postgres@localhost:5432/fcc_conference',
    },
  }),
  sharp,
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
