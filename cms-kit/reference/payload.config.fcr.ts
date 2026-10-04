import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Abstracts } from './collections/Abstracts'
import { AbstractStatuses } from './collections/AbstractStatuses'
import { Appendices } from './collections/Appendices'
import { AgendaItems } from './collections/AgendaItems'
import { ConferenceDays } from './collections/ConferenceDays'
import { Conferences } from './collections/Conferences'
import { Countries } from './collections/Countries'
import { Institutions } from './collections/Institutions'
import { ItalianRegions } from './collections/ItalianRegions'
import { Media } from './collections/Media'
import { People } from './collections/People'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { ActiveConference } from './ActiveConference/config'
import { ConferenceArchive } from './ConferenceArchive/config'
import { iconPlugin } from './fields/icon'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import {
  ABSTRACT_PICTURES_FOLDER_NAME,
  assignMediaToFolder,
  CONFERENCE_LOGOS_FOLDER_NAME,
  ensureMediaFolder,
  mediaIdFromUpload,
  PEOPLE_PHOTOS_FOLDER_NAME,
} from './utilities/mediaFolder'
import { seedAbstractStatuses } from './utilities/seedAbstractStatuses'
import { seedCountries } from './utilities/seedCountries'
import { seedItalianRegions } from './utilities/seedItalianRegions'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      afterNavLinks: ['@/components/admin/SiteNavGroup'],
      beforeDashboard: ['@/components/admin/SiteDashboardGroup'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    // Prefer migrations over interactive drizzle push prompts in dev.
    push: false,
  }),
  collections: [
    Media,
    Users,
    AbstractStatuses,
    Abstracts,
    Appendices,
    AgendaItems,
    ConferenceDays,
    Conferences,
    Countries,
    Institutions,
    ItalianRegions,
    People,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  plugins: [
    ...plugins,
    iconPlugin,
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  globals: [Footer, ActiveConference, ConferenceArchive],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    await ensureMediaFolder({
      folderName: CONFERENCE_LOGOS_FOLDER_NAME,
      payload,
    })
    await ensureMediaFolder({
      folderName: PEOPLE_PHOTOS_FOLDER_NAME,
      payload,
    })
    await ensureMediaFolder({
      folderName: ABSTRACT_PICTURES_FOLDER_NAME,
      payload,
    })
    await seedAbstractStatuses({ payload })
    await seedItalianRegions({ payload })
    await seedCountries({ payload })

    const moveUploadToFolder = async ({
      folderName,
      mediaId,
      label,
    }: {
      folderName: string
      mediaId: number | string | null
      label: string
    }) => {
      if (mediaId == null) return

      try {
        await assignMediaToFolder({
          folderName,
          mediaId,
          payload,
        })
      } catch (err) {
        payload.logger.error({
          err,
          msg: `Failed to move existing ${label} ${mediaId} into ${folderName} folder`,
        })
      }
    }

    const { docs: conferences } = await payload.find({
      collection: 'conferences',
      depth: 0,
      limit: 1000,
      pagination: false,
      select: {
        logo: true,
      },
    })

    for (const conference of conferences) {
      await moveUploadToFolder({
        folderName: CONFERENCE_LOGOS_FOLDER_NAME,
        label: 'conference logo',
        mediaId: mediaIdFromUpload(conference.logo),
      })
    }

    const { docs: people } = await payload.find({
      collection: 'people',
      depth: 0,
      limit: 1000,
      pagination: false,
      select: {
        photo: true,
      },
    })

    for (const person of people) {
      await moveUploadToFolder({
        folderName: PEOPLE_PHOTOS_FOLDER_NAME,
        label: 'people photo',
        mediaId: mediaIdFromUpload(person.photo),
      })
    }

    const { docs: abstracts } = await payload.find({
      collection: 'abstracts',
      depth: 0,
      draft: true,
      limit: 1000,
      pagination: false,
      select: {
        picture: true,
      },
    })

    for (const abstract of abstracts) {
      const rows = Array.isArray(abstract.picture) ? abstract.picture : []
      for (const row of rows) {
        await moveUploadToFolder({
          folderName: ABSTRACT_PICTURES_FOLDER_NAME,
          label: 'abstract picture',
          mediaId: mediaIdFromUpload(
            (row as { image?: unknown } | null | undefined)?.image,
          ),
        })
      }
    }
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
