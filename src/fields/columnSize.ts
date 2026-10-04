import type { SelectField } from 'payload'

export const INTRO_COLUMN_SIZES = ['full', 'twoThirds', 'half', 'oneThird'] as const

export type IntroColumnSize = (typeof INTRO_COLUMN_SIZES)[number]

export const columnSizeField = (): SelectField => ({
  name: 'size',
  type: 'select',
  required: true,
  defaultValue: 'full',
  label: 'Width',
  options: [
    { label: 'Full', value: 'full' },
    { label: 'Two thirds', value: 'twoThirds' },
    { label: 'Half', value: 'half' },
    { label: 'One third', value: 'oneThird' },
  ],
})
