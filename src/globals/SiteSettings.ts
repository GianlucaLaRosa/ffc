import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings / Active Conference',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'activeConference',
      type: 'relationship',
      relationTo: 'conferences',
      required: true,
      label: 'Active Conference for Homepage',
      admin: {
        description: 'Select the conference edition to be featured and displayed on the public website.',
      },
    },
  ],
}
