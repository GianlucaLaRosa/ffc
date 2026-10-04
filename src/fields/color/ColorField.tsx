'use client'

import type { TextFieldClientComponent } from 'payload'
import { FieldLabel, useField } from '@payloadcms/ui'
import React from 'react'

import './colorField.scss'

function normalizeHex(value: string | undefined | null): string {
  if (!value) return '#000000'
  const trimmed = value.trim()
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed.toLowerCase()
  if (/^#[0-9A-Fa-f]{3}$/.test(trimmed)) {
    const [, r, g, b] = trimmed
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }
  return '#000000'
}

export const ColorField: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue } = useField<string>({ path })
  const label = 'label' in field ? field.label : field.name
  const required = 'required' in field ? Boolean(field.required) : false
  const hex = normalizeHex(value)

  return (
    <div className="field-type color-field">
      <FieldLabel htmlFor={`field-${path}`} label={label} required={required} />
      <div className="color-field__controls">
        <input
          id={`field-${path}-picker`}
          aria-label="Pick color"
          className="color-field__native"
          type="color"
          value={hex}
          disabled={Boolean(readOnly)}
          onChange={(event) => setValue(event.target.value)}
        />
        <input
          id={`field-${path}`}
          aria-label="Hex value"
          className="color-field__hex"
          type="text"
          value={value ?? ''}
          placeholder="#000000"
          disabled={Boolean(readOnly)}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </div>
  )
}
