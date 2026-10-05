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
    singular: 'Conferenza',
    plural: 'Conferenze',
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
    group: 'Conferenze',
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'publicArchive', 'city', 'updatedAt'],
    description:
      'Edizioni della conferenza. Aprite un’edizione per gestire giorni, abstract e appendice.',
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
        description: 'Nome formattato della conferenza. Title e slug si ricavano da questo testo.',
      },
      validate: (value) => {
        if (!value) return 'Name è obbligatorio.'
        const plaintext = toPlainTitle(value as LexicalJSON)
        if (!plaintext) return 'Name deve contenere del testo.'
        return true
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Panoramica',
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
                    description: 'Anno dell’edizione. Più edizioni nello stesso anno sono ammesse.',
                  },
                },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  admin: mediaFolderUploadAdmin(CONFERENCE_LOGOS_FOLDER_NAME, {
                    width: '70%',
                    description: `Usato nell’intestazione e come icona della scheda del browser. Cartella Media «${CONFERENCE_LOGOS_FOLDER_NAME}».`,
                  }),
                },
              ],
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
                    description:
                      'Pulsanti, link e accenti delle sezioni. Si adatta da solo a tema chiaro e scuro.',
                  },
                }),
                colorField({
                  name: 'secondaryColor',
                  label: 'Secondary color',
                  required: true,
                  defaultValue: '#3b82f6',
                  admin: {
                    width: '50%',
                    description:
                      'Keynote, badge e evidenziazioni secondarie. Si adatta da solo a tema chiaro e scuro.',
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
          label: 'Giorni',
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
                description: 'Ordinati per data (la più vicina per prima). Un giorno per data di calendario.',
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
                description:
                  'Abstract scientifici di questa edizione. Collegateli alle sessioni dall’abstract o dalla sessione.',
              },
            },
          ],
        },
        {
          label: 'Appendice',
          fields: [
            {
              name: 'appendices',
              type: 'join',
              collection: 'appendices',
              on: 'conference',
              label: 'Appendix',
              admin: {
                defaultColumns: ['_status', 'updatedAt'],
                description:
                  'Al massimo un’appendice per conferenza. Apritela per aggiungere blocchi e trascinarli per l’ordine.',
              },
            },
          ],
        },
        {
          label: 'Avvisi',
          description:
            'Avvisi in tempo reale (cambio orario, sala, ecc.). Il banner sul sito compare salvando con Show site banner. La push va inviata con Invia push (solo edizione in Conferenza attiva).',
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
                description:
                  'Avvisi brevi in testo semplice. Trascinate per l’ordine del banner. Create un nuovo avviso per ogni push: non si può reinviare.',
              },
            },
          ],
        },
        {
          label: 'Sede',
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
                    description: 'Coordinata X (es. 13.8046 per Trieste).',
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
                    description: 'Coordinata Y (es. 45.6495 per Trieste).',
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
                description: 'Dettagli facoltativi (sala, ingresso, accessibilità).',
              },
            },
          ],
        },
        {
          label: 'Scheda pubblica',
          description:
            'Come viene descritta questa edizione quando qualcuno la trova su Google, quando si condivide il link, o quando un assistente AI risponde a una domanda. Scrivi in modo semplice. Se non sei sicuro, lascia il campo vuoto: il sito userà nome della conferenza, sede e date.',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'Google, social, and browser tab',
              admin: {
                description:
                  'Questo blocco è la scheda breve che le persone vedono prima di aprire la pagina: il titolo blu su Google, l’anteprima su WhatsApp o LinkedIn, e il testo nella scheda del browser. Non è il contenuto della pagina (quello sta in Name, Intro e Venue).',
              },
              fields: [
                OverviewField({
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                  imagePath: 'meta.image',
                  overrides: {
                    label: 'Length check',
                    admin: {
                      description:
                        'Indica se titolo, testo breve e immagine qui sotto sono compilati, e se titolo e testo hanno una lunghezza adatta a Google. Il verde è un orientamento, non un obbligo.',
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
                      description:
                        'Il titolo che Google e motori simili mostrano di solito. Scrivi il nome dell’edizione come la cercherebbe una persona, con l’anno se serve (esempio: «FCR 2026 — Trieste»). Resta sotto i 60 caratteri circa, così non viene tagliato. Usa Generate per copiare il nome della conferenza, poi accorcialo se serve. Se lo lasci vuoto, la pagina pubblica usa il nome della conferenza più «FCR».',
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
                      description:
                        'L’immagine che compare quando qualcuno condivide il link di questa edizione (WhatsApp, Slack, LinkedIn, email). Meglio una foto orizzontale ampia della sede, del manifesto o del logo su sfondo semplice. Punta a meno di 500 KB; il limite di caricamento è 12 MB. Un’immagine 1200×630 px riempie l’anteprima senza tagliare il soggetto. Se la lasci vuota, il sito usa l’immagine di condivisione predefinita FCR.',
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
                      description:
                        'Due frasi (circa 150–160 caratteri) che compaiono sotto il titolo su Google e nell’anteprima di condivisione. Di’ che edizione è, dove si svolge e a chi è rivolta. Esempio: «FCR 2026 è un incontro di medicina rigenerativa a Trieste per clinici e ricercatori. Date, sede e programma.» Non inserire elenchi di parole chiave. Se lo lasci vuoto, i motori di ricerca ricostruiranno il testo dalla pagina.',
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
                      description:
                        'Una bozza di come titolo, indirizzo web e testo breve possono apparire su Google. I risultati reali possono differire. Usala per controllare che il testo resti chiaro anche se viene tagliato.',
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
                description:
                  'Facoltativo. ChatGPT, Gemini, Perplexity e strumenti simili citano spesso fatti brevi e stabili, non i testi lunghi della pagina. Compila questi campi perché possano nominare l’edizione in modo corretto. Non vengono mostrati come FAQ sul sito. Date, città, indirizzo e coordinate si prendono da Days e Venue: non ripeterli qui, salvo che ti serva una formulazione precisa in una riga.',
              },
              fields: [
                {
                  name: 'summary',
                  type: 'textarea',
                  label: 'Plain-language summary',
                  maxLength: 320,
                  admin: {
                    description:
                      'Una o due frasi di fatto che un assistente può citare. Inizia con il nome ufficiale, poi luogo, destinatari e tema. Esempio: «FCR 2026 è l’incontro annuale FCR di medicina rigenerativa, a Trieste, per clinici e ricercatori.» Evita slogan («il convegno migliore di sempre»). Se è vuoto, gli assistenti usano il testo breve sopra, poi il contenuto della pagina.',
                  },
                },
                {
                  name: 'primaryEntity',
                  type: 'text',
                  label: 'Official name of this edition',
                  admin: {
                    description:
                      'Il nome esatto che vuoi sia citato come soggetto della pagina, per non confonderla con un altro anno o un altro evento FCR. Esempio: «FCR 2026» o «Fondazione conferenza 2026, Trieste». Tienilo breve. Se è vuoto, si usa il nome della conferenza.',
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
                    description:
                      'Coppie brevi etichetta–valore da citare così come sono. Usale per ciò che è facile sbagliare (tema, destinatari, lingua, organizzato da). Non duplicare città, indirizzo o date, salvo che serva una frase precisa. Esempi: Tema → Medicina rigenerativa; Destinatari → Clinici e ricercatori; Lingua → Inglese. Bastano quattro-otto fatti.',
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
                        description:
                          'Il tipo di fatto, in una o due parole. Esempi: Tema, Destinatari, Lingua, Organizzato da.',
                      },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      label: 'Value',
                      admin: {
                        description:
                          'Il fatto, come lo diresti a un collega. Una sola riga. Esempio: «Clinici e ricercatori accademici».',
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
        description: 'Title in testo semplice ricavato da Name (elenchi, slug e scheda pubblica).',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description:
          'Prima messa online di questa edizione. Resta stabile per la SEO; non sono le date dell’evento (quelle stanno in Days).',
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
