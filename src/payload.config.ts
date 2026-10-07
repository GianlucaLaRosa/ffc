import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { en } from 'payload/i18n/en'
import { it } from 'payload/i18n/it'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

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
import { ConferenceNotices } from './collections/ConferenceNotices'
import { ProgrammePushSubscriptions } from './collections/ProgrammePushSubscriptions'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { ActiveConference } from './ActiveConference/config'
import { ConferenceArchive } from './ConferenceArchive/config'
import { ProgrammeAlerts } from './ProgrammeAlerts/config'
import { iconPlugin } from './fields/icon'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getVercelBlobAccess } from './utilities/blobAccess'
import { getServerSideURL } from './utilities/getURL'
import {
  ABSTRACT_PICTURES_FOLDER_NAME,
  assignMediaToFolder,
  CONFERENCE_LOGOS_FOLDER_NAME,
  ensureMediaFolder,
  mediaIdFromUpload,
  PARTNER_LOGOS_FOLDER_NAME,
  PEOPLE_PHOTOS_FOLDER_NAME,
} from './utilities/mediaFolder'
import { seedAbstractStatuses } from './utilities/seedAbstractStatuses'
import { seedCountries } from './utilities/seedCountries'
import { seedFooterContent } from './utilities/seedFooterContent'
import { seedFooterPolicies } from './utilities/seedFooterPolicies'
import { seedItalianRegions } from './utilities/seedItalianRegions'
import { adminTranslations } from './i18n/adminTranslations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: getServerSideURL(),
  admin: {
    meta: {
      titleSuffix: ' — FFC Ricerca',
      description:
        'Panel of the Fondazione per la Ricerca sulla Fibrosi Cistica - ETS. Manage conference editions.',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/brand/ffc-ricerca-32.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          url: '/brand/ffc-ricerca.png',
        },
      ],
    },
    components: {
      graphics: {
        Icon: '@/components/admin/graphics/Icon',
        Logo: '@/components/admin/graphics/Logo',
      },
      beforeLogin: ['@/components/BeforeLogin'],
      beforeNavLinks: ['@/components/admin/EditActiveEditionNavLink'],
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
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en, it },
    translations: adminTranslations,
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI || 'postgresql://postgres:postgres@localhost:5432/fcc_conference',
    },
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
    ConferenceNotices,
    Conferences,
    Countries,
    Institutions,
    ItalianRegions,
    People,
    ProgrammePushSubscriptions,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  plugins: [
    ...plugins,
    iconPlugin,
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Plugin types only list 'public'; @vercel/blob supports private stores too.
      access: getVercelBlobAccess() as 'public',
    }),
  ],
  globals: [Footer, ActiveConference, ConferenceArchive, ProgrammeAlerts],
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-at-least-32-characters-long',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    try {
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
      await ensureMediaFolder({
        folderName: PARTNER_LOGOS_FOLDER_NAME,
        payload,
      })
      await seedAbstractStatuses({ payload })
      await seedItalianRegions({ payload })
      await seedCountries({ payload })
      await seedFooterPolicies({ payload })
      await seedFooterContent({ payload })
    } catch (err) {
      payload.logger.error({ err, msg: 'Payload onInit bootstrap failed' })
    }

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

    try {
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

      const footer = await payload.findGlobal({
        slug: 'footer',
        depth: 0,
      })
      const partnerRows = Array.isArray(footer.partners) ? footer.partners : []
      for (const row of partnerRows) {
        await moveUploadToFolder({
          folderName: PARTNER_LOGOS_FOLDER_NAME,
          label: 'partner logo',
          mediaId: mediaIdFromUpload((row as { image?: unknown } | null | undefined)?.image),
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
            mediaId: mediaIdFromUpload((row as { image?: unknown } | null | undefined)?.image),
          })
        }
      }
    } catch (err) {
      payload.logger.error({ err, msg: 'Payload onInit media folder sync failed' })
    }
  },
})
