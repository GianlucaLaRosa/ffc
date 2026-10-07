/**
 * Seeds the 23rd FFC Ricerca Convention (Verona, 13–15 November 2025)
 * from the published investigator brochure.
 *
 * Lookup tables (countries, regions, abstract statuses) still seed in Payload onInit.
 * Idempotent: if the edition already exists, only missing abstract photos are attached.
 * Does not set Active conference — pick the home edition in admin.
 */
import './env'

import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(dirname, '../..')

import { getPayload, type Payload } from 'payload'

import config from '@payload-config'
import { syncBrochureMediaToBlob, uploadBytesToBlob } from '@/seed/blobUpload'
import {
  createLexicalDoc,
  createLexicalList,
  createLexicalParagraph,
  createLexicalRoot,
} from '@/seed/lexicalHelpers'
import { ABSTRACT_APPENDICES } from '@/seed/data/convention2025AbstractAppendices'
import { ABSTRACT_CONTENT } from '@/seed/data/convention2025AbstractContent'
import { ABSTRACT_PICTURES } from '@/seed/data/convention2025AbstractPictures'
import {
  ABSTRACTS,
  CONVENTION_2025_PARTNERS,
  CONVENTION_2025_TITLE,
  INSTITUTIONS,
  KEYNOTE_SPEAKERS,
  type SeedAbstract,
} from '@/seed/data/convention2025'
import {
  ABSTRACT_AUTHOR_LISTS,
  BROCHURE_INSTITUTIONS,
  BROCHURE_PEOPLE,
  type BrochureAbstractAuthor,
} from '@/seed/data/convention2025People'
import {
  calendarDay,
  findCountryId,
  findOrCreateInstitution,
  findOrCreatePerson,
  findRegionId,
  findStatusId,
  lucide,
  publishCreate,
  seedAbstractPictureRows,
  splitPersonName,
  wallClockTime,
} from '@/seed/helpers'
import {
  ABSTRACT_PICTURES_FOLDER_NAME,
  CONFERENCE_LOGOS_FOLDER_NAME,
  ensureMediaFolder,
} from '@/utilities/mediaFolder'
import { seedFooterPartners } from '@/seed/footerPartners'
import { seedFooterContent } from '@/utilities/seedFooterContent'

const ABSTRACT_PICTURES_DIR = path.resolve(dirname, 'assets/convention2025/pictures')

const SEED_CONTEXT = { disableRevalidate: true } as const

function personDisplayKey(person: { firstName: string; lastName: string }): string {
  return `${person.firstName} ${person.lastName}`
}

function authorRoleForAbstract(
  author: BrochureAbstractAuthor,
  abs: SeedAbstract,
): 'primaryInvestigator' | 'partner' | 'teamMember' {
  const authorKey = personDisplayKey(author)
  const primaryKey = personDisplayKey(splitPersonName(abs.authors[0]!))
  if (authorKey === primaryKey) return 'primaryInvestigator'

  const partnerKeys = new Set(
    abs.authors.slice(1).map((name) => personDisplayKey(splitPersonName(name))),
  )
  if (partnerKeys.has(authorKey)) return 'partner'

  return 'teamMember'
}

const SESSION_TITLES: Record<number, string> = {
  1: 'Session 1 — The multifaceted Kaftrio',
  2: 'Session 2 — Modulators and genetic therapies',
  3: 'Session 3 — Hot inflammation topics',
  4: 'Session 4 — The NTM challenge',
  5: 'Session 5 — Flash presentation: FFC Ricerca facilities and new projects',
  6: 'Session 6 — Phages and fungi',
  7: 'Session 7 — Tackling Pseudomonas aeruginosa',
  8: 'Session 8 — Different challenges, different approaches',
}

type AgendaSpec = {
  key: string
  title: string
  start: [number, number]
  end: [number, number]
  icon?: string
  isKeynote?: boolean
  description?: string
}

const DAYS: Array<{
  date: string
  start: [number, number]
  end: [number, number]
  items: AgendaSpec[]
}> = [
  {
    date: '2025-11-13',
    start: [9, 30],
    end: [18, 30],
    items: [
      {
        key: 'thu-reg',
        title: 'Registration and poster display',
        start: [9, 30],
        end: [10, 30],
        icon: 'clipboard-list',
      },
      {
        key: 'thu-welcome',
        title: 'Welcome and greetings',
        start: [10, 30],
        end: [11, 30],
        icon: 'handshake',
      },
      {
        key: 'thu-intro',
        title: 'Introduction to the 23rd FFC Ricerca Convention',
        start: [11, 30],
        end: [11, 40],
        icon: 'megaphone',
      },
      {
        key: 's1',
        title: SESSION_TITLES[1]!,
        start: [11, 40],
        end: [13, 0],
        icon: 'presentation',
      },
      {
        key: 'thu-lunch',
        title: 'Lunch',
        start: [13, 0],
        end: [14, 30],
        icon: 'utensils',
      },
      {
        key: 's2',
        title: SESSION_TITLES[2]!,
        start: [14, 30],
        end: [16, 30],
        icon: 'presentation',
      },
      {
        key: 'thu-coffee',
        title: 'Coffee break & Poster session A',
        start: [16, 30],
        end: [17, 45],
        icon: 'coffee',
      },
      {
        key: 'thu-keynote',
        title: 'Keynote — CFTR in the Kidney: Physiology and Clinical Implications',
        start: [17, 45],
        end: [18, 30],
        icon: 'sparkles',
        isKeynote: true,
        description: 'Peder Matzen Berg',
      },
    ],
  },
  {
    date: '2025-11-14',
    start: [9, 0],
    end: [22, 0],
    items: [
      {
        key: 's3',
        title: SESSION_TITLES[3]!,
        start: [9, 0],
        end: [10, 30],
        icon: 'presentation',
      },
      {
        key: 'fri-coffee-am',
        title: 'Coffee break',
        start: [10, 30],
        end: [11, 0],
        icon: 'coffee',
      },
      {
        key: 's4',
        title: SESSION_TITLES[4]!,
        start: [11, 0],
        end: [12, 10],
        icon: 'presentation',
      },
      {
        key: 's5',
        title: SESSION_TITLES[5]!,
        start: [12, 10],
        end: [13, 0],
        icon: 'zap',
      },
      {
        key: 'fri-photo',
        title: 'Group photo at Auditorium',
        start: [13, 0],
        end: [13, 15],
        icon: 'camera',
      },
      {
        key: 'fri-lunch',
        title: 'Lunch & Poster session B',
        start: [13, 15],
        end: [15, 20],
        icon: 'utensils',
      },
      {
        key: 's6',
        title: SESSION_TITLES[6]!,
        start: [15, 20],
        end: [16, 30],
        icon: 'presentation',
      },
      {
        key: 'fri-keynote',
        title:
          'Keynote — CFTR Protein Structure and Function: Known Knowns, Known Unknowns and Unknown Unknowns',
        start: [16, 30],
        end: [17, 15],
        icon: 'sparkles',
        isKeynote: true,
        description: 'David N. Sheppard',
      },
      {
        key: 'fri-dinner',
        title: 'Social dinner',
        start: [20, 0],
        end: [22, 0],
        icon: 'wine',
      },
    ],
  },
  {
    date: '2025-11-15',
    start: [9, 0],
    end: [13, 0],
    items: [
      {
        key: 's7',
        title: SESSION_TITLES[7]!,
        start: [9, 0],
        end: [11, 0],
        icon: 'presentation',
      },
      {
        key: 'sat-coffee',
        title: 'Coffee break',
        start: [11, 0],
        end: [11, 30],
        icon: 'coffee',
      },
      {
        key: 's8',
        title: SESSION_TITLES[8]!,
        start: [11, 30],
        end: [12, 40],
        icon: 'presentation',
      },
      {
        key: 'sat-close',
        title: 'Closing remarks',
        start: [12, 40],
        end: [12, 55],
        icon: 'flag',
      },
    ],
  },
]

const introLayout = () => [
  {
    blockType: 'content' as const,
    columns: [
      {
        size: 'full' as const,
        content: createLexicalRoot([
          createLexicalParagraph([
            { text: CONVENTION_2025_TITLE, bold: true },
            { text: ' — Verona, 13–15 November 2025.' },
          ]),
          createLexicalParagraph(
            'The 23rd Convention of FFC Ricerca investigators in cystic fibrosis presents work in progress from projects funded in 2023–2025. Sessions cover CFTR modulators and genetic therapies, inflammation, nontuberculous mycobacteria, phage and fungal research, and Pseudomonas aeruginosa.',
          ),
        ]),
      },
    ],
  },
  {
    blockType: 'callout' as const,
    size: 'full' as const,
    tone: 'deadline' as const,
    title: 'Venue',
    body: createLexicalDoc(['Centro Congressi Camera di Commercio, Corso Porta Nuova 96, Verona.']),
  },
  {
    blockType: 'cta' as const,
    size: 'half' as const,
    label: 'Programme',
    destination: 'programme' as const,
    appearance: 'solid' as const,
  },
  {
    blockType: 'cta' as const,
    size: 'half' as const,
    label: 'Abstracts & appendix',
    destination: 'appendix' as const,
    appearance: 'outline' as const,
  },
]

async function attachAbstractPictures(payload: Payload, conferenceId: number | string) {
  const folderId = await ensureMediaFolder({
    folderName: ABSTRACT_PICTURES_FOLDER_NAME,
    payload,
  })

  const { docs } = await payload.find({
    collection: 'abstracts',
    depth: 0,
    draft: true,
    limit: 200,
    pagination: false,
    where: { conference: { equals: conferenceId } },
  })

  const byCode = new Map(docs.map((doc) => [doc.code, doc]))
  let attached = 0
  let skipped = 0

  for (const abs of ABSTRACTS) {
    const doc = byCode.get(abs.code)
    if (!doc) {
      payload.logger.warn(`No seeded abstract with code “${abs.code}”; skipping photos.`)
      continue
    }
    if (Array.isArray(doc.picture) && doc.picture.length > 0) {
      skipped += 1
      continue
    }

    const pictures = ABSTRACT_PICTURES[abs.n]
    if (!pictures?.length) {
      throw new Error(`Missing brochure photos for abstract ${abs.n} (${abs.code})`)
    }

    const picture = await seedAbstractPictureRows(payload, {
      folderId,
      picturesDir: ABSTRACT_PICTURES_DIR,
      pictures,
    })

    await payload.update({
      collection: 'abstracts',
      id: doc.id,
      data: { picture },
      depth: 0,
      draft: false,
      overrideAccess: true,
      context: SEED_CONTEXT,
    })
    attached += 1
    payload.logger.info(`Photos for ${abs.code} (${pictures.length})`)
  }

  payload.logger.info(`Abstract photos: attached ${attached}, already present ${skipped}.`)
}

function seedDatabaseLabel(): string {
  const uri = process.env.DATABASE_URI ?? ''
  if (uri.includes('neon.tech')) return 'Neon (remote)'
  if (uri.includes('localhost') || uri.includes('127.0.0.1')) return 'localhost Postgres'
  if (uri.includes('@db:')) return 'Docker Postgres'
  return 'DATABASE_URI (custom host)'
}

async function seed() {
  const payload = await getPayload({ config })
  payload.logger.info(`Seed target: ${seedDatabaseLabel()}`)

  const existing = await payload.find({
    collection: 'conferences',
    depth: 0,
    draft: true,
    limit: 1,
    pagination: false,
    where: {
      and: [{ year: { equals: 2025 } }, { title: { equals: CONVENTION_2025_TITLE } }],
    },
  })

  if (existing.docs[0]) {
    payload.logger.info(
      `Convention 2025 already exists (id ${existing.docs[0].id}). Attaching missing abstract photos…`,
    )
    await attachAbstractPictures(payload, existing.docs[0].id)
    await seedFooterContent({ payload })
    await seedFooterPartners({ payload })
    await syncBrochureMediaToBlob(payload, projectRoot)
    process.exit(0)
  }

  const italyId = await findCountryId(payload, 'Italy')
  const statusIds = {
    new: await findStatusId(payload, 'new'),
    ongoing: await findStatusId(payload, 'ongoing'),
    concluded: await findStatusId(payload, 'concluded'),
  }

  const countryIds = new Map<string, number>([['Italy', italyId]])
  const regionIds = new Map<string, number>()
  const institutionIds = new Map<string, number>()

  const seedInstitutions = [...INSTITUTIONS]
  const seenInstitutionNames = new Set(INSTITUTIONS.map((inst) => inst.name))
  for (const inst of BROCHURE_INSTITUTIONS) {
    if (seenInstitutionNames.has(inst.name)) continue
    seedInstitutions.push(inst)
    seenInstitutionNames.add(inst.name)
  }

  for (const inst of seedInstitutions) {
    if (!countryIds.has(inst.country)) {
      countryIds.set(inst.country, await findCountryId(payload, inst.country))
    }
    let regionId: number | undefined
    if (inst.region) {
      if (!regionIds.has(inst.region)) {
        regionIds.set(inst.region, await findRegionId(payload, inst.region))
      }
      regionId = regionIds.get(inst.region)
    }
    const id = await findOrCreateInstitution({
      payload,
      name: inst.name,
      countryId: countryIds.get(inst.country)!,
      regionId,
    })
    institutionIds.set(inst.name, id)
  }

  payload.logger.info('Creating people from brochure affiliations…')
  for (const person of BROCHURE_PEOPLE) {
    const institutionId =
      person.institution != null ? institutionIds.get(person.institution) : undefined
    await findOrCreatePerson({
      payload,
      firstName: person.firstName,
      lastName: person.lastName,
      institutionId,
    })
  }

  const picturesFolder = await ensureMediaFolder({
    folderName: ABSTRACT_PICTURES_FOLDER_NAME,
    payload,
  })
  const logoFolder = await ensureMediaFolder({
    folderName: CONFERENCE_LOGOS_FOLDER_NAME,
    payload,
  })
  const logoPath = path.resolve(dirname, '../../public/brand/ffc-ricerca.png')
  const logoBuffer = readFileSync(logoPath)
  const logo = await payload.create({
    collection: 'media',
    depth: 0,
    overrideAccess: true,
    context: SEED_CONTEXT,
    data: {
      alt: 'FFC Ricerca',
      folder: logoFolder,
    },
    file: {
      data: logoBuffer,
      mimetype: 'image/png',
      name: path.basename(logoPath),
      size: logoBuffer.length,
    },
  })
  if (typeof logo.filename === 'string' && logo.filename) {
    await uploadBytesToBlob(payload, {
      buffer: logoBuffer,
      filename: logo.filename,
      mimeType: 'image/png',
    })
  }

  payload.logger.info('Creating conference…')
  const conference = await publishCreate(payload, 'conferences', {
    name: createLexicalDoc([CONVENTION_2025_TITLE]),
    year: 2025,
    logo: logo.id,
    primaryColor: '#0d5c3a',
    secondaryColor: '#2ecc71',
    intro: introLayout(),
    city: 'Verona',
    country: 'Italy',
    address: 'Corso Porta Nuova 96',
    latitude: 45.4384,
    longitude: 10.9917,
    location: createLexicalDoc([
      'Centro Congressi Camera di Commercio. Foundation offices: Piazzale Aristide Stefani 1, c/o Azienda Ospedaliera Universitaria Integrata, 37126 Verona.',
    ]),
    meta: {
      title: 'FFC Ricerca 2025 — Verona',
      description:
        '23rd Convention of Investigators in Cystic Fibrosis, 13–15 November 2025 at the Camera di Commercio in Verona. Programme, abstracts, and appendix from FFC Ricerca funded projects.',
    },
    geo: {
      summary:
        'The 23rd Convention of Investigators in Cystic Fibrosis is the 2025 FFC Ricerca meeting in Verona for researchers working on Foundation-funded CF projects.',
      primaryEntity: '23rd Convention of Investigators in Cystic Fibrosis',
      keyFacts: [
        {
          label: 'Topic',
          value: 'Cystic fibrosis research (FFC Ricerca funded projects 2023–2025)',
        },
        { label: 'Audience', value: 'Investigators, clinicians, and research partners' },
        { label: 'Language', value: 'English' },
        { label: 'Organised by', value: 'Fondazione per la Ricerca sulla Fibrosi Cistica - ETS' },
      ],
    },
    publishedAt: '2025-11-01T00:00:00.000Z',
  })

  const conferenceId = conference.id as number
  const sessionAgendaIds = new Map<number, number>()

  for (const daySpec of DAYS) {
    payload.logger.info(`Creating day ${daySpec.date}…`)
    const day = await publishCreate(payload, 'conference-days', {
      conference: conferenceId,
      date: calendarDay(daySpec.date),
      startTime: wallClockTime(...daySpec.start),
      endTime: wallClockTime(...daySpec.end),
    })

    for (const item of daySpec.items) {
      const created = await publishCreate(payload, 'agenda-items', {
        name: createLexicalDoc([item.title]),
        day: day.id,
        startTime: wallClockTime(...item.start),
        endTime: wallClockTime(...item.end),
        isKeynote: Boolean(item.isKeynote),
        icon: lucide(item.icon ?? 'calendar'),
        ...(item.description ? { description: createLexicalDoc([item.description]) } : {}),
      })
      const match = /^s(\d)$/.exec(item.key)
      if (match) sessionAgendaIds.set(Number(match[1]), created.id as number)
    }
  }

  for (const speaker of KEYNOTE_SPEAKERS) {
    await findOrCreatePerson({
      payload,
      firstName: speaker.firstName,
      lastName: speaker.lastName,
    })
  }

  payload.logger.info('Creating abstracts…')
  for (const abs of ABSTRACTS) {
    const agendaId = sessionAgendaIds.get(abs.session)
    if (agendaId == null) throw new Error(`Missing session ${abs.session} for abstract ${abs.n}`)

    const brochureAuthors = ABSTRACT_AUTHOR_LISTS[abs.n]
    if (!brochureAuthors?.length) {
      throw new Error(`Missing brochure authors for abstract ${abs.n} (${abs.code})`)
    }

    const speakerKey = personDisplayKey(splitPersonName(abs.speaker ?? abs.authors[0]!))
    const authors = []
    for (const author of brochureAuthors) {
      const institutionId =
        author.institution != null ? institutionIds.get(author.institution) : undefined
      const personId = await findOrCreatePerson({
        payload,
        firstName: author.firstName,
        lastName: author.lastName,
        institutionId,
      })
      authors.push({
        person: personId,
        role: authorRoleForAbstract(author, abs),
        isSpeaker: personDisplayKey(author) === speakerKey,
      })
    }

    const sections = ABSTRACT_CONTENT[abs.n]
    if (!sections?.length) {
      throw new Error(`Missing brochure content for abstract ${abs.n} (${abs.code})`)
    }

    const pictureSpec = ABSTRACT_PICTURES[abs.n]
    if (!pictureSpec?.length) {
      throw new Error(`Missing brochure photos for abstract ${abs.n} (${abs.code})`)
    }
    const picture = await seedAbstractPictureRows(payload, {
      folderId: picturesFolder,
      picturesDir: ABSTRACT_PICTURES_DIR,
      pictures: pictureSpec,
    })

    await publishCreate(payload, 'abstracts', {
      conference: conferenceId,
      agendaItems: [agendaId],
      title: createLexicalDoc([abs.title]),
      code: abs.code,
      status: statusIds[abs.status],
      relatedCodes: (abs.relatedCodes ?? []).map((code) => ({
        code,
        status: statusIds.new,
      })),
      content: sections.map((section) => ({
        title: section.title,
        description: createLexicalDoc([section.description]),
      })),
      appendices: [abs.code, ...(abs.relatedCodes ?? [])].map((code) => {
        const row = ABSTRACT_APPENDICES[code]
        if (!row) return { title: null, body: null }
        return {
          title: row.title,
          body: createLexicalDoc(row.body),
        }
      }),
      authors,
      picture,
    })
  }

  payload.logger.info('Creating appendix…')
  await publishCreate(payload, 'appendices', {
    conference: conferenceId,
    blocks: [
      {
        blockType: 'basicText',
        title: 'About this edition',
        icon: lucide('book-open'),
        layout: [
          {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                content: createLexicalRoot([
                  createLexicalParagraph(
                    'Source: Brochure, 23rd Convention of Investigators in Cystic Fibrosis, Verona, 13–15 November 2025 (Fondazione per la Ricerca sulla Fibrosi Cistica - ETS).',
                  ),
                  createLexicalParagraph(
                    'Printed November 2025. Editorial team: Alessandra Ria, Luisa Alessio, Ermanno Rizzi, Federica Lavarini. Cover image courtesy of Roberto Plebani.',
                  ),
                  createLexicalList([
                    '1. Recent publications (2021–2025) from studies funded by FFC Ricerca',
                    '2. Institutes and laboratories involved in FFC Ricerca projects',
                    '3. International reviewers of the most recent FFC Ricerca projects',
                    '4. FFC Ricerca projects (2023–2025) adopted by supporters',
                  ]),
                ]),
              },
            ],
          },
        ],
      },
      {
        blockType: 'institutions',
        title: 'Institutes and laboratories',
        icon: lucide('building-2'),
        description: createLexicalDoc([
          'A selection of institutes and laboratories involved in FFC Ricerca projects, as listed in brochure appendix 2.',
        ]),
        institutions: [...institutionIds.values()],
      },
      {
        blockType: 'researchProjects',
        title: 'FFC Ricerca projects 2023–2025',
        icon: lucide('flask-conical'),
        description: createLexicalRoot([
          createLexicalParagraph(
            'Oral presentations cover FFC Ricerca funded work (2023–2025), including facilities CFaCore, CFDB and SCP, strategic projects (Molecules 3.0, GenDel-CF, De-risking GY, MindKids-CF), and yearly FFC / GMSG / GMRF grants listed in the brochure index.',
          ),
        ]),
      },
      {
        blockType: 'reviewers',
        title: 'International reviewers',
        icon: lucide('users'),
        description: createLexicalDoc([
          'International reviewers of the most recent FFC Ricerca projects are listed by country in appendix 3 of the printed 2025 brochure (Asia and Middle East, Australia, Canada, Europe, and the Americas).',
        ]),
      },
    ],
  })

  await seedFooterContent({ payload })
  await seedFooterPartners({ payload })
  await syncBrochureMediaToBlob(payload, projectRoot)

  payload.logger.info(
    `Seeded conference ${conferenceId}. Set Active conference in admin when you want it on the home page.`,
  )
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
