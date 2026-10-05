import type { Field, GlobalConfig, TextFieldValidation } from 'payload'

import { iconField } from '@/fields/icon'
import { revalidateFooter } from './hooks/revalidateFooter'

const httpsUrl: TextFieldValidation = (value) => {
  if (value == null || value === '') return true

  try {
    const parsed = new URL(String(value))
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return 'Usate un URL http o https'
    }
    return true
  } catch {
    return 'Usate un URL valido'
  }
}

const labelRequiredWhenUrl: TextFieldValidation = (value, { siblingData }) => {
  const url =
    siblingData &&
    typeof siblingData === 'object' &&
    'url' in siblingData &&
    typeof siblingData.url === 'string'
      ? siblingData.url.trim()
      : ''

  if (url && (value == null || String(value).trim() === '')) {
    return 'Label è obbligatorio se è impostato URL'
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
        description: 'Icona Lucide facoltativa.',
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
            description: 'Sito esterno. Si apre in una nuova scheda.',
          },
          validate: httpsUrl,
        },
      ],
    },
  ],
})

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Piè di pagina',
  access: {
    read: () => true,
  },
  fields: [
    orgLinkGroup('structure', 'Structure'),
    orgLinkGroup('delegation', 'Delegation'),
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
