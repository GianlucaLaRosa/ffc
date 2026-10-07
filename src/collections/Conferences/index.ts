import type { CollectionBeforeValidateHook, CollectionConfig, UIField } from 'payload'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { basicLexical } from '../../fields/basicLexical'
import { colorField } from '../../fields/color'
import { introLayoutField } from '../../fields/introLayout'
import { generateConferenceIntroPreviewPath } from '../../utilities/generatePreviewPath'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { assignLogoToFolder } from './hooks/assignLogoToFolder'
import { togglePublicArchiveEndpoint } from './endpoints/togglePublicArchive'
import { mediaFolderUploadAdmin } from '@/fields/mediaFolderUpload'
import { CONFERENCE_LOGOS_FOLDER_NAME } from '@/utilities/mediaFolder'
import {
  revalidatePublicArchive,
  revalidatePublicArchiveDelete,
} from './hooks/revalidatePublicArchive'
import { adminGroups, copy } from '@/i18n/copy'
import { asT } from '@/i18n/asT'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

type LexicalJSON = Parameters<typeof convertLexicalToPlaintext>[0]['data']

const toPlainTitle = (name: LexicalJSON): string =>
  convertLexicalToPlaintext({ data: name }).replace(/\s+/g, ' ').trim()

const populateTitleFromName: CollectionBeforeValidateHook = ({ data }) => {
  if (!data?.name) return data

  const plaintext = toPlainTitle(data.name as LexicalJSON)

  if (plaintext) {
    data.title = plaintext
  }

  return data
}

const slugifyValue = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

export const Conferences: CollectionConfig<'conferences'> = {
  slug: 'conferences',
  labels: {
    singular: copy('Conference', 'Conferenza'),
    plural: copy('Conferences', 'Conferenze'),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    year: true,
    publicArchive: true,
  },
  admin: {
    group: adminGroups.conferences,
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'publicArchive', 'city', 'updatedAt'],
    description: copy(
      'Conference editions. Open an edition to manage days, abstracts, and the appendix.',
      'Edizioni della conferenza. Aprite un’edizione per gestire giorni, abstract e appendice.',
    ),
    livePreview: {
      url: ({ data }) =>
        generateConferenceIntroPreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : null,
        }),
    },
    preview: (data) =>
      generateConferenceIntroPreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : null,
      }),
  },
  endpoints: [togglePublicArchiveEndpoint],
  fields: [
    {
      name: 'name',
      type: 'richText',
      required: true,
      editor: basicLexical,
      label: 'Name',
      admin: {
        description: copy(
          'Formatted conference name. Title and slug are derived from this text.',
          'Nome formattato della conferenza. Title e slug si ricavano da questo testo.',
        ),
      },
      validate: (value, { req }) => {
        if (!value) return asT(req.t)('fcr:nameRequired')
        const plaintext = toPlainTitle(value as LexicalJSON)
        if (!plaintext) return asT(req.t)('fcr:nameMustHaveText')
        return true
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: copy('Overview', 'Panoramica'),
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'year',
                  type: 'number',
                  required: true,
                  min: 1900,
                  max: 2100,
                  admin: {
                    width: '30%',
                    description: copy(
                      'Edition year. Several editions in the same year are allowed.',
                      'Anno dell’edizione. Più edizioni nello stesso anno sono ammesse.',
                    ),
                  },
                },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  admin: mediaFolderUploadAdmin(CONFERENCE_LOGOS_FOLDER_NAME, {
                    width: '70%',
                    description: copy(
                      `Used in the header and as the browser tab icon. Media folder “${CONFERENCE_LOGOS_FOLDER_NAME}”.`,
                      `Usato nell’intestazione e come icona della scheda del browser. Cartella Media «${CONFERENCE_LOGOS_FOLDER_NAME}».`,
                    ),
                  }),
                },
              ],
            },
            {
              name: 'headerEyebrow',
              type: 'text',
              label: 'Header eyebrow',
              admin: {
                description: copy(
                  'Small uppercase line above the event name in the site header (e.g. Scientific Event). Leave empty for the default (Scientific Event, or Archived edition on archive pages).',
                  'Riga piccola in maiuscole sopra il nome dell’evento nell’intestazione del sito (es. Scientific Event). Lasciate vuoto per il default (Scientific Event, oppure Archived edition nelle pagine archivio).',
                ),
              },
            },
            {
              type: 'row',
              fields: [
                colorField({
                  name: 'primaryColor',
                  label: 'Primary color',
                  required: true,
                  defaultValue: '#0f172a',
                  admin: {
                    width: '50%',
                    description: copy(
                      'Buttons, links, and section accents. Adapts automatically to light and dark theme.',
                      'Pulsanti, link e accenti delle sezioni. Si adatta da solo a tema chiaro e scuro.',
                    ),
                  },
                }),
                colorField({
                  name: 'secondaryColor',
                  label: 'Secondary color',
                  required: true,
                  defaultValue: '#3b82f6',
                  admin: {
                    width: '50%',
                    description: copy(
                      'Keynotes, badges, and secondary highlights. Adapts automatically to light and dark theme.',
                      'Keynote, badge e evidenziazioni secondarie. Si adatta da solo a tema chiaro e scuro.',
                    ),
                  },
                }),
              ],
            },
          ],
        },
        {
          label: 'Intro',
          fields: [introLayoutField()],
        },
        {
          label: copy('Days', 'Giorni'),
          fields: [
            {
              name: 'days',
              type: 'join',
              collection: 'conference-days',
              on: 'conference',
              label: 'Conference days',
              defaultSort: 'date',
              admin: {
                defaultColumns: ['date', 'startTime', 'endTime', '_status'],
                description: copy(
                  'Sorted by date (soonest first). One day per calendar date.',
                  'Ordinati per data (la più vicina per prima). Un giorno per data di calendario.',
                ),
              },
            },
          ],
        },
        {
          label: 'Abstract',
          fields: [
            {
              name: 'abstracts',
              type: 'join',
              collection: 'abstracts',
              on: 'conference',
              label: 'Abstracts',
              orderable: true,
              defaultSort: '_abstracts_abstracts_order',
              admin: {
                defaultColumns: ['plainTitle', 'code', 'status', '_status'],
                description: copy(
                  'Scientific abstracts for this edition. Link them to sessions from the abstract or from the session.',
                  'Abstract scientifici di questa edizione. Collegateli alle sessioni dall’abstract o dalla sessione.',
                ),
              },
            },
          ],
        },
        {
          label: copy('Appendix', 'Appendice'),
          fields: [
            {
              name: 'appendices',
              type: 'join',
              collection: 'appendices',
              on: 'conference',
              label: 'Appendix',
              admin: {
                defaultColumns: ['_status', 'updatedAt'],
                description: copy(
                  'At most one appendix per conference. Open it to add blocks and drag them to reorder.',
                  'Al massimo un’appendice per conferenza. Apritela per aggiungere blocchi e trascinarli per l’ordine.',
                ),
              },
            },
          ],
        },
        {
          label: copy('Notices', 'Avvisi'),
          description: copy(
            'Live notices (time change, room, etc.). The site banner appears when you save with Show site banner. Send the push with Send push (Active conference edition only).',
            'Avvisi in tempo reale (cambio orario, sala, ecc.). Il banner sul sito compare salvando con Show site banner. La push va inviata con Invia push (solo edizione in Conferenza attiva).',
          ),
          fields: [
            {
              name: 'notices',
              type: 'join',
              collection: 'conference-notices',
              on: 'conference',
              label: 'Conference notices',
              orderable: true,
              defaultSort: '_conference-notices_notices_order',
              admin: {
                defaultColumns: ['title', 'severity', 'showOnSite', 'sentAt', 'updatedAt'],
                description: copy(
                  'Short plain-text notices. Drag to set banner order. Create a new notice for each push: it cannot be sent again.',
                  'Avvisi brevi in testo semplice. Trascinate per l’ordine del banner. Create un nuovo avviso per ogni push: non si può reinviare.',
                ),
              },
            },
          ],
        },
        {
          label: copy('Venue', 'Sede'),
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'city',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'country',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'address',
              type: 'text',
              required: true,
              label: 'Address',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'longitude',
                  type: 'number',
                  label: 'Longitude',
                  min: -180,
                  max: 180,
                  admin: {
                    width: '50%',
                    step: 0.000001,
                    description: copy(
                      'X coordinate (e.g. 13.8046 for Trieste).',
                      'Coordinata X (es. 13.8046 per Trieste).',
                    ),
                  },
                },
                {
                  name: 'latitude',
                  type: 'number',
                  label: 'Latitude',
                  min: -90,
                  max: 90,
                  admin: {
                    width: '50%',
                    step: 0.000001,
                    description: copy(
                      'Y coordinate (e.g. 45.6495 for Trieste).',
                      'Coordinata Y (es. 45.6495 per Trieste).',
                    ),
                  },
                },
              ],
            },
            {
              name: 'location',
              type: 'richText',
              editor: basicLexical,
              label: 'Location notes',
              admin: {
                description: copy(
                  'Optional details (room, entrance, accessibility).',
                  'Dettagli facoltativi (sala, ingresso, accessibilità).',
                ),
              },
            },
          ],
        },
        {
          label: copy('Public listing', 'Scheda pubblica'),
          description: copy(
            'How this edition is described when someone finds it on Google, when the link is shared, or when an AI assistant answers a question. Write plainly. If you are unsure, leave the field empty: the site will use the conference name, venue, and dates.',
            'Come viene descritta questa edizione quando qualcuno la trova su Google, quando si condivide il link, o quando un assistente AI risponde a una domanda. Scrivi in modo semplice. Se non sei sicuro, lascia il campo vuoto: il sito userà nome della conferenza, sede e date.',
          ),
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'Google, social, and browser tab',
              admin: {
                description: copy(
                  'This block is the short card people see before opening the page: the blue title on Google, the preview on WhatsApp or LinkedIn, and the browser tab text. It is not the page content (that lives in Name, Intro, and Venue).',
                  'Questo blocco è la scheda breve che le persone vedono prima di aprire la pagina: il titolo blu su Google, l’anteprima su WhatsApp o LinkedIn, e il testo nella scheda del browser. Non è il contenuto della pagina (quello sta in Name, Intro e Venue).',
                ),
              },
              fields: [
                OverviewField({
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                  imagePath: 'meta.image',
                  overrides: {
                    label: 'Length check',
                    admin: {
                      description: copy(
                        'Shows whether title, short text, and image below are filled, and whether title and text are a sensible length for Google. Green is a guide, not a requirement.',
                        'Indica se titolo, testo breve e immagine qui sotto sono compilati, e se titolo e testo hanno una lunghezza adatta a Google. Il verde è un orientamento, non un obbligo.',
                      ),
                      components: {
                        Field: {
                          clientProps: {
                            titlePath: 'meta.title',
                            descriptionPath: 'meta.description',
                            imagePath: 'meta.image',
                          },
                          path: '@payloadcms/plugin-seo/client#OverviewComponent',
                        },
                      },
                    } as UIField['admin'],
                  },
                }),
                MetaTitleField({
                  hasGenerateFn: true,
                  overrides: {
                    localized: false,
                    label: 'Result title',
                    admin: {
                      description: copy(
                        'The title Google and similar engines usually show. Write the edition name as someone would search for it, with the year if needed (example: “FCR 2026 — Trieste”). Stay around 60 characters so it is not cut. Use Generate to copy the conference name, then shorten it if needed. If you leave it empty, the public page uses the conference name plus “FCR”.',
                        'Il titolo che Google e motori simili mostrano di solito. Scrivi il nome dell’edizione come la cercherebbe una persona, con l’anno se serve (esempio: «FCR 2026 — Trieste»). Resta sotto i 60 caratteri circa, così non viene tagliato. Usa Generate per copiare il nome della conferenza, poi accorcialo se serve. Se lo lasci vuoto, la pagina pubblica usa il nome della conferenza più «FCR».',
                      ),
                      components: {
                        Field: {
                          clientProps: { hasGenerateTitleFn: true },
                          path: '@/collections/Conferences/SeoMetaTitle#SeoMetaTitle',
                        },
                      },
                    },
                  },
                }),
                MetaImageField({
                  relationTo: 'media',
                  overrides: {
                    localized: false,
                    label: 'Preview image',
                    admin: {
                      description: copy(
                        'The image that appears when someone shares this edition’s link (WhatsApp, Slack, LinkedIn, email). Prefer a wide landscape photo of the venue, poster, or logo on a simple background. Aim under 500 KB; the upload limit is 12 MB. A 1200×630 px image fills the preview without cropping the subject. If you leave it empty, the site uses the default FCR share image.',
                        'L’immagine che compare quando qualcuno condivide il link di questa edizione (WhatsApp, Slack, LinkedIn, email). Meglio una foto orizzontale ampia della sede, del manifesto o del logo su sfondo semplice. Punta a meno di 500 KB; il limite di caricamento è 12 MB. Un’immagine 1200×630 px riempie l’anteprima senza tagliare il soggetto. Se la lasci vuota, il sito usa l’immagine di condivisione predefinita FCR.',
                      ),
                      components: {
                        Field: {
                          clientProps: { hasGenerateImageFn: false },
                          path: '@payloadcms/plugin-seo/client#MetaImageComponent',
                        },
                      },
                    },
                  },
                }),
                MetaDescriptionField({
                  overrides: {
                    localized: false,
                    label: 'Short listing text',
                    admin: {
                      description: copy(
                        'Two sentences (about 150–160 characters) under the title on Google and in the share preview. Say which edition it is, where it is held, and who it is for. Example: “FCR 2026 is a regenerative medicine meeting in Trieste for clinicians and researchers. Dates, venue, and programme.” Do not paste keyword lists. If you leave it empty, search engines reconstruct the text from the page.',
                        'Due frasi (circa 150–160 caratteri) che compaiono sotto il titolo su Google e nell’anteprima di condivisione. Di’ che edizione è, dove si svolge e a chi è rivolta. Esempio: «FCR 2026 è un incontro di medicina rigenerativa a Trieste per clinici e ricercatori. Date, sede e programma.» Non inserire elenchi di parole chiave. Se lo lasci vuoto, i motori di ricerca ricostruiranno il testo dalla pagina.',
                      ),
                      components: {
                        Field: {
                          clientProps: { hasGenerateDescriptionFn: false },
                          path: '@payloadcms/plugin-seo/client#MetaDescriptionComponent',
                        },
                      },
                    },
                  },
                }),
                PreviewField({
                  hasGenerateFn: true,
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                  overrides: {
                    label: 'Example of the Google listing',
                    admin: {
                      description: copy(
                        'A draft of how title, web address, and short text can appear on Google. Real results can differ. Use it to check the text stays clear if it is cut.',
                        'Una bozza di come titolo, indirizzo web e testo breve possono apparire su Google. I risultati reali possono differire. Usala per controllare che il testo resti chiaro anche se viene tagliato.',
                      ),
                      components: {
                        Field: {
                          clientProps: {
                            descriptionPath: 'meta.description',
                            hasGenerateURLFn: true,
                            titlePath: 'meta.title',
                          },
                          path: '@/collections/Conferences/SeoPreview#SeoPreview',
                        },
                      },
                    } as UIField['admin'],
                  },
                }),
              ],
            },
            {
              name: 'geo',
              type: 'group',
              label: 'Facts for AI answers',
              admin: {
                description: copy(
                  'Optional. ChatGPT, Gemini, Perplexity, and similar tools often cite short stable facts, not long page copy. Fill these so they can name the edition correctly. They are not shown as FAQs on the site. Dates, city, address, and coordinates come from Days and Venue: do not repeat them here unless you need a precise one-line wording.',
                  'Facoltativo. ChatGPT, Gemini, Perplexity e strumenti simili citano spesso fatti brevi e stabili, non i testi lunghi della pagina. Compila questi campi perché possano nominare l’edizione in modo corretto. Non vengono mostrati come FAQ sul sito. Date, città, indirizzo e coordinate si prendono da Days e Venue: non ripeterli qui, salvo che ti serva una formulazione precisa in una riga.',
                ),
              },
              fields: [
                {
                  name: 'summary',
                  type: 'textarea',
                  label: 'Plain-language summary',
                  maxLength: 320,
                  admin: {
                    description: copy(
                      'One or two factual sentences an assistant can quote. Start with the official name, then place, audience, and topic. Example: “FCR 2026 is the annual FCR regenerative medicine meeting in Trieste for clinicians and researchers.” Avoid slogans. If empty, assistants use the short listing text above, then the page content.',
                      'Una o due frasi di fatto che un assistente può citare. Inizia con il nome ufficiale, poi luogo, destinatari e tema. Esempio: «FCR 2026 è l’incontro annuale FCR di medicina rigenerativa, a Trieste, per clinici e ricercatori.» Evita slogan («il convegno migliore di sempre»). Se è vuoto, gli assistenti usano il testo breve sopra, poi il contenuto della pagina.',
                    ),
                  },
                },
                {
                  name: 'primaryEntity',
                  type: 'text',
                  label: 'Official name of this edition',
                  admin: {
                    description: copy(
                      'The exact name you want cited as the subject of the page, so it is not confused with another year or FCR event. Example: “FCR 2026” or “Fondazione conferenza 2026, Trieste”. Keep it short. If empty, the conference name is used.',
                      'Il nome esatto che vuoi sia citato come soggetto della pagina, per non confonderla con un altro anno o un altro evento FCR. Esempio: «FCR 2026» o «Fondazione conferenza 2026, Trieste». Tienilo breve. Se è vuoto, si usa il nome della conferenza.',
                    ),
                  },
                },
                {
                  name: 'keyFacts',
                  type: 'array',
                  label: 'Key facts',
                  labels: {
                    singular: 'Fact',
                    plural: 'Facts',
                  },
                  admin: {
                    description: copy(
                      'Short label–value pairs to quote as-is. Use them for things that are easy to get wrong (topic, audience, language, organised by). Do not duplicate city, address, or dates unless you need a precise sentence. Examples: Topic → Regenerative medicine; Audience → Clinicians and researchers; Language → English. Four to eight facts are enough.',
                      'Coppie brevi etichetta–valore da citare così come sono. Usale per ciò che è facile sbagliare (tema, destinatari, lingua, organizzato da). Non duplicare città, indirizzo o date, salvo che serva una frase precisa. Esempi: Tema → Medicina rigenerativa; Destinatari → Clinici e ricercatori; Lingua → Inglese. Bastano quattro-otto fatti.',
                    ),
                    initCollapsed: false,
                    components: {
                      RowLabel: '@/collections/Conferences/KeyFactRowLabel#KeyFactRowLabel',
                    },
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Label',
                      admin: {
                        description: copy(
                          'The kind of fact, in one or two words. Examples: Topic, Audience, Language, Organised by.',
                          'Il tipo di fatto, in una o due parole. Esempi: Tema, Destinatari, Lingua, Organizzato da.',
                        ),
                      },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      label: 'Value',
                      admin: {
                        description: copy(
                          'The fact, as you would tell a colleague. One line. Example: “Clinicians and academic researchers”.',
                          'Il fatto, come lo diresti a un collega. Una sola riga. Esempio: «Clinici e ricercatori accademici».',
                        ),
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: copy(
          'Plain-text Title derived from Name (lists, slug, and public listing).',
          'Title in testo semplice ricavato da Name (elenchi, slug e scheda pubblica).',
        ),
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: copy(
          'First time this edition went live. Stays stable for SEO; these are not the event dates (those live in Days).',
          'Prima messa online di questa edizione. Resta stabile per la SEO; non sono le date dell’evento (quelle stanno in Days).',
        ),
      },
    },
    {
      name: 'publicArchive',
      type: 'checkbox',
      defaultValue: false,
      label: 'Public archive',
      admin: {
        // Toggled from the Conference archive global; kept on the document for queries.
        hidden: true,
      },
    },
    slugField({
      useAsSlug: 'title',
      slugify: ({ data, valueToSlugify }) => {
        const titleFromName =
          data?.name != null ? toPlainTitle(data.name as LexicalJSON) : ''
        const baseSource =
          (typeof valueToSlugify === 'string' && valueToSlugify) ||
          (typeof data?.title === 'string' && data.title) ||
          titleFromName

        if (!baseSource) return undefined

        const base = slugifyValue(baseSource)
        const year = typeof data?.year === 'number' ? data.year : undefined

        return year ? `${year}-${base}` : base
      },
    }),
  ],
  hooks: {
    beforeValidate: [populateTitleFromName],
    beforeChange: [populatePublishedAt],
    afterChange: [assignLogoToFolder, revalidatePublicArchive],
    afterDelete: [revalidatePublicArchiveDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 800,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
