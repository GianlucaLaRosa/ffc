import type { Field, GlobalConfig, TextFieldValidation } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { basicLexical } from '@/fields/basicLexical'
import { flexibleLexical } from '@/fields/flexibleLexical'
import { iconField } from '@/fields/icon'
import { mediaFolderUploadAdmin } from '@/fields/mediaFolderUpload'
import { copy } from '@/i18n/copy'
import { asT } from '@/i18n/asT'
import { PARTNER_LOGOS_FOLDER_NAME } from '@/utilities/mediaFolder'
import { assignPartnerLogosToFolder } from './hooks/assignPartnerLogosToFolder'
import { revalidateFooter } from './hooks/revalidateFooter'

const httpsUrl: TextFieldValidation = (value, { req }) => {
  if (value == null || value === '') return true

  try {
    const parsed = new URL(String(value))
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return asT(req.t)('fcr:httpsUrl')
    }
    return true
  } catch {
    return asT(req.t)('fcr:validUrl')
  }
}

const labelRequiredWhenUrl: TextFieldValidation = (value, { siblingData, req }) => {
  const url =
    siblingData &&
    typeof siblingData === 'object' &&
    'url' in siblingData &&
    typeof siblingData.url === 'string'
      ? siblingData.url.trim()
      : ''

  if (url && (value == null || String(value).trim() === '')) {
    return asT(req.t)('fcr:labelRequiredWithUrl')
  }

  return true
}

const orgLinkGroup = (name: 'structure' | 'delegation', label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    iconField({
      name: 'icon',
      label: 'Icon',
      required: false,
      admin: {
        description: copy('Optional Lucide icon.', 'Icona Lucide facoltativa.'),
      },
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          admin: { width: '50%' },
          validate: labelRequiredWhenUrl,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          admin: {
            width: '50%',
            placeholder: 'https://',
            description: copy(
              'External site. Opens in a new tab.',
              'Sito esterno. Si apre in una nuova scheda.',
            ),
          },
          validate: httpsUrl,
        },
      ],
    },
  ],
})

const policyChromeFields = (defaults: {
  title: string
  kicker: string
  headerBadge: string
}): Field[] => [
  {
    name: 'title',
    type: 'text',
    label: 'Title',
    required: true,
    defaultValue: defaults.title,
    admin: {
      description: copy(
        'Page heading and footer link label.',
        'Titolo della pagina e etichetta del link nel piè di pagina.',
      ),
    },
  },
  {
    type: 'row',
    fields: [
      {
        name: 'kicker',
        type: 'text',
        label: 'Kicker',
        defaultValue: defaults.kicker,
        admin: {
          width: '50%',
          description: copy(
            'Small label above the title.',
            'Etichetta piccola sopra il titolo.',
          ),
        },
      },
      {
        name: 'headerBadge',
        type: 'text',
        label: 'Header badge',
        defaultValue: defaults.headerBadge,
        admin: {
          width: '50%',
          description: copy(
            'Badge in the top bar on desktop.',
            'Badge nella barra in alto su desktop.',
          ),
        },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'lastUpdated',
        type: 'text',
        label: 'Last updated',
        admin: {
          width: '40%',
          description: copy(
            'Shown as “Last updated: …”.',
            'Mostrato come “Last updated: …”.',
          ),
        },
      },
      {
        name: 'metaDescription',
        type: 'textarea',
        label: 'Meta description',
        admin: {
          width: '60%',
          description: copy(
            'Search snippet for this page.',
            'Testo per i motori di ricerca di questa pagina.',
          ),
        },
      },
    ],
  },
  {
    name: 'intro',
    type: 'richText',
    label: 'Intro',
    editor: basicLexical,
    admin: {
      description: copy(
        'Lead paragraph under the title.',
        'Paragrafo di apertura sotto il titolo.',
      ),
    },
  },
]

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: copy('Footer', 'Piè di pagina'),
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    description: copy(
      'Institutional footer links, partner logos, credits, and the public Cookie Policy and Privacy Policy pages.',
      'Link istituzionali del piè di pagina, loghi partner, crediti e le pagine pubbliche Cookie Policy e Privacy Policy.',
    ),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: copy('Links', 'Link'),
          fields: [orgLinkGroup('structure', 'Structure'), orgLinkGroup('delegation', 'Delegation')],
        },
        {
          label: copy('Partners', 'Partner'),
          description: copy(
            'Logos in the site footer. Optional URL opens in a new tab.',
            'Loghi nel piè di pagina del sito. L’URL facoltativo si apre in una nuova scheda.',
          ),
          fields: [
            {
              name: 'partners',
              type: 'array',
              label: 'Partners',
              labels: {
                singular: copy('Partner', 'Partner'),
                plural: copy('Partners', 'Partner'),
              },
              admin: {
                initCollapsed: true,
                description: copy(
                  `Upload order is the display order. Media folder “${PARTNER_LOGOS_FOLDER_NAME}”.`,
                  `L’ordine di caricamento è l’ordine di visualizzazione. Cartella Media «${PARTNER_LOGOS_FOLDER_NAME}».`,
                ),
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  label: 'Image',
                  relationTo: 'media',
                  required: true,
                  admin: mediaFolderUploadAdmin(PARTNER_LOGOS_FOLDER_NAME),
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      admin: {
                        width: '50%',
                        placeholder: 'https://',
                        description: copy(
                          'Partner site. Opens in a new tab.',
                          'Sito del partner. Si apre in una nuova scheda.',
                        ),
                      },
                      validate: httpsUrl,
                    },
                    {
                      name: 'alt',
                      type: 'text',
                      label: 'Alt text',
                      admin: {
                        width: '50%',
                        description: copy(
                          'Short description of the logo for screen readers. If empty, the Media Alt Text is used.',
                          'Descrizione breve del logo per i lettori di schermo. Se vuoto, si usa Alt Text del Media.',
                        ),
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: copy('Credits', 'Crediti'),
          description: copy(
            'Roles and names shown in the site footer.',
            'Ruoli e nomi mostrati nel piè di pagina del sito.',
          ),
          fields: [
            {
              name: 'credits',
              type: 'array',
              label: 'Credits',
              labels: {
                singular: copy('Credit', 'Credito'),
                plural: copy('Credits', 'Crediti'),
              },
              admin: {
                initCollapsed: true,
                description: copy(
                  'Display order follows this list.',
                  'L’ordine di visualizzazione segue questo elenco.',
                ),
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'role',
                      type: 'text',
                      label: 'Role',
                      required: true,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Name',
                      required: true,
                      admin: { width: '60%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: copy('Cookie Policy', 'Cookie Policy'),
          description: copy(
            'Public page at /cookie-policy. Footer always links here.',
            'Pagina pubblica su /cookie-policy. Il piè di pagina punta sempre qui.',
          ),
          fields: [
            {
              name: 'cookiePolicy',
              type: 'group',
              label: false,
              fields: [
                ...policyChromeFields({
                  title: 'Cookie Policy',
                  kicker: 'Official Policy & Compliance Statement',
                  headerBadge: 'Zero Tracking Platform',
                }),
                {
                  name: 'summaryTitle',
                  type: 'text',
                  label: 'Summary title',
                  admin: {
                    description: copy(
                      'Heading of the highlighted summary box.',
                      'Titolo del riquadro di sintesi in evidenza.',
                    ),
                  },
                },
                {
                  name: 'summary',
                  type: 'richText',
                  label: 'Summary',
                  editor: basicLexical,
                },
                {
                  name: 'highlights',
                  type: 'array',
                  label: 'Highlights',
                  labels: {
                    singular: copy('Highlight', 'Evidenza'),
                    plural: copy('Highlights', 'Evidenze'),
                  },
                  admin: {
                    description: copy(
                      'Short points under the summary (e.g. no profiling cookies).',
                      'Punti brevi sotto la sintesi (es. niente cookie di profilazione).',
                    ),
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Label',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'content',
                  type: 'richText',
                  label: 'Content',
                  editor: flexibleLexical,
                  admin: {
                    description: copy(
                      'Numbered sections of the cookie statement (use Heading 3).',
                      'Sezioni numerate dell’informativa cookie (usate Heading 3).',
                    ),
                  },
                },
              ],
            },
          ],
        },
        {
          label: copy('Privacy Policy', 'Privacy Policy'),
          description: copy(
            'Public page at /privacy. Footer always links here.',
            'Pagina pubblica su /privacy. Il piè di pagina punta sempre qui.',
          ),
          fields: [
            {
              name: 'privacyPolicy',
              type: 'group',
              label: false,
              fields: [
                ...policyChromeFields({
                  title: 'Privacy Policy',
                  kicker: 'Articles 13 & 14 - Regulation (EU) 2016/679 (GDPR)',
                  headerBadge: 'GDPR Compliant',
                }),
                {
                  type: 'collapsible',
                  label: copy('Data controller', 'Titolare del trattamento'),
                  admin: { initCollapsed: false },
                  fields: [
                    {
                      name: 'controllerName',
                      type: 'text',
                      label: 'Controller name',
                    },
                    {
                      name: 'controllerAddress',
                      type: 'textarea',
                      label: 'Controller address',
                    },
                    {
                      name: 'controllerWebsite',
                      type: 'text',
                      label: 'Controller website',
                      admin: { placeholder: 'https://' },
                      validate: httpsUrl,
                    },
                  ],
                },
                {
                  name: 'content',
                  type: 'richText',
                  label: 'Content',
                  editor: flexibleLexical,
                  admin: {
                    description: copy(
                      'Main body after the controller box (use Heading 3 / Heading 4).',
                      'Corpo principale dopo il riquadro del titolare (usate Heading 3 / Heading 4).',
                    ),
                  },
                },
                {
                  name: 'rightsHeading',
                  type: 'text',
                  label: 'Rights heading',
                },
                {
                  name: 'rightsIntro',
                  type: 'richText',
                  label: 'Rights intro',
                  editor: basicLexical,
                },
                {
                  name: 'rights',
                  type: 'array',
                  label: 'Rights',
                  labels: {
                    singular: copy('Right', 'Diritto'),
                    plural: copy('Rights', 'Diritti'),
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Title',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Description',
                    },
                  ],
                },
                {
                  name: 'complaintNote',
                  type: 'richText',
                  label: 'Complaint note',
                  editor: basicLexical,
                  admin: {
                    description: copy(
                      'Closing note on lodging a complaint with the Garante.',
                      'Nota finale sul reclamo al Garante.',
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
  hooks: {
    afterChange: [assignPartnerLogosToFolder, revalidateFooter],
  },
}
