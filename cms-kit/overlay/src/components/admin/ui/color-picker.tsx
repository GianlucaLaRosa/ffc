'use client'

import * as React from 'react'

import { Input } from '@/components/admin/ui/input'
import { cn } from '@/utilities/ui'

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

export type ColorPickerProps = {
  className?: string
  defaultValue?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
  value?: string
}

export function ColorPicker({
  className,
  defaultValue = '#3b82f6',
  disabled,
  onValueChange,
  value,
}: ColorPickerProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const currentValue = normalizeHex(value ?? internalValue)

  const update = (next: string) => {
    const normalized = next.startsWith('#') ? next : `#${next}`
    if (value === undefined) setInternalValue(normalized)
    onValueChange?.(normalized)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        aria-label="Pick color"
        type="color"
        value={currentValue}
        disabled={disabled}
        className="size-10 shrink-0 cursor-pointer rounded-md border bg-transparent p-0.5"
        onChange={(event) => update(event.target.value)}
      />
      <Input
        aria-label="Hex value"
        value={value ?? internalValue}
        disabled={disabled}
        className="font-mono uppercase"
        placeholder="#000000"
        onChange={(event) => update(event.target.value)}
      />
    </div>
  )
}
