import { iconField } from '@/fields/icon'

/** Lucide picker for the public appendix tab. Empty uses a per-block-type default. */
export const appendixTabIconField = () =>
  iconField({
    name: 'icon',
    label: 'Tab icon',
    required: false,
    admin: {
      description:
        'Shown next to the tab title. If empty, a default icon for this block type is used.',
    },
  })
