import type { TextField } from 'payload'

type ColorFieldOptions = {
  name: string
  label?: TextField['label']
  required?: boolean
  defaultValue?: string
  admin?: TextField['admin']
}

const hexColorPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

export const colorField = ({
  name,
  label,
  required,
  defaultValue,
  admin,
}: ColorFieldOptions): TextField => ({
  name,
  type: 'text',
  label,
  required,
  defaultValue,
  validate: (value) => {
    if (!value) {
      return required ? 'Questo campo è obbligatorio.' : true
    }
    if (!hexColorPattern.test(value)) {
      return 'Inserite un colore esadecimale valido (es. #3b82f6).'
    }
    return true
  },
  admin: {
    ...admin,
    components: {
      ...admin?.components,
      Field: '@/fields/color/ColorField#ColorField',
    },
  },
})
