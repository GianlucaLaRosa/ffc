import { createIconPlugin, lucideProvider } from 'payload-plugin-icons'

/**
 * Lucide-only icon picker for admin fields.
 * Phosphor is installed as a peer of payload-plugin-icons but not registered.
 */
const created = createIconPlugin({
  providers: [lucideProvider({ label: 'Lucide' })],
})

export const iconPlugin = created.iconPlugin

type IconFieldOptions = Parameters<typeof created.iconField>[0]

/** Icon field that skips the provider UI (Lucide is the only provider). */
export const iconField = (options: IconFieldOptions) => {
  const field = created.iconField(options)
  const existingComponents = field.admin?.components ?? {}
  const existingField = existingComponents.Field

  const clientProps =
    typeof existingField === 'object' && existingField !== null && 'clientProps' in existingField
      ? existingField.clientProps
      : { providerIds: ['lucide'], labelsById: { lucide: 'Lucide' } }

  field.admin = {
    ...field.admin,
    components: {
      ...existingComponents,
      Field: {
        clientProps,
        path: '@/fields/icon/LucideIconField#LucideIconField',
      },
    },
  }

  return field
}
