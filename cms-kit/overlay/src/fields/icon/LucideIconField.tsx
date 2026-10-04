'use client'

import { FieldDescription, FieldLabel, useField } from '@payloadcms/ui'
import { useEffect, useMemo, useRef, useState } from 'react'

import { RenderSerializedIcon, type SerializedIcon } from './renderSerializedIcon'
import './LucideIconField.scss'

const PROVIDER = 'lucide'
const ICONS_CHUNK = 100

type CatalogResponse = {
  icons?: { name: string }[]
}

type FieldProps = {
  field: {
    admin?: { description?: string }
    label?: string
    name?: string
    required?: boolean
  }
  path: string
  readOnly?: boolean
}

async function fetchCatalog(): Promise<string[]> {
  const response = await fetch(`/api/payload-icons/${PROVIDER}/catalog`)
  if (!response.ok) throw new Error('Unable to load Lucide icon catalog')
  const data = (await response.json()) as CatalogResponse
  return (data.icons ?? []).map((icon) => icon.name).sort((a, b) => a.localeCompare(b))
}

async function fetchDefinitions(names: string[]): Promise<Record<string, SerializedIcon>> {
  const definitions: Record<string, SerializedIcon> = {}

  for (let offset = 0; offset < names.length; offset += ICONS_CHUNK) {
    const chunk = names.slice(offset, offset + ICONS_CHUNK)
    const response = await fetch(`/api/payload-icons/${PROVIDER}/icons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ names: chunk }),
    })
    if (!response.ok) throw new Error('Unable to load Lucide icons')
    Object.assign(definitions, (await response.json()) as Record<string, SerializedIcon>)
  }

  return definitions
}

/**
 * Flat Lucide picker: every icon name is its own tile (no category/variant grouping),
 * no pagination — one scrollable list with a max height.
 */
export const LucideIconField = (props: FieldProps) => {
  const { field, path, readOnly } = props
  const providerPath = `${path}.provider`
  const namePath = `${path}.name`

  const { setValue: setProvider, value: providerValue } = useField<string>({ path: providerPath })
  const { setValue: setName, value: nameValue } = useField<string>({ path: namePath })

  const [search, setSearch] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [allNames, setAllNames] = useState<string[]>([])
  const [definitions, setDefinitions] = useState<Record<string, SerializedIcon>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!providerValue) {
      void setProvider(PROVIDER)
    }
  }, [providerValue, setProvider])

  useEffect(() => {
    if (!showPicker || loadedRef.current) return

    let active = true
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const names = await fetchCatalog()
        if (!active) return
        setAllNames(names)
        const defs = await fetchDefinitions(names)
        if (!active) return
        setDefinitions(defs)
        loadedRef.current = true
      } catch {
        if (active) setError('Could not load Lucide icons.')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [showPicker])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPicker])

  const filteredNames = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return allNames
    return allNames.filter((name) => name.toLowerCase().includes(query))
  }, [allNames, search])

  const required = Boolean(field.required)
  const searchInputId = `${path}-icon-search`
  const selectedDefinition = nameValue ? definitions[nameValue] : undefined

  return (
    <div className="lucide-icon-field" ref={rootRef}>
      <div className="field-label-wrapper">
        <FieldLabel
          htmlFor={searchInputId}
          label={field.label ?? field.name ?? 'Icon'}
          path={path}
          required={required}
        />
      </div>

      <div className="icon-search-wrapper">
        <input
          aria-label="Search icons"
          className="icon-search-input"
          id={searchInputId}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={() => setShowPicker(true)}
          placeholder="Search icons… (e.g. mic, coffee, users)"
          readOnly={readOnly}
          type="text"
          value={search}
        />
      </div>

      {nameValue ? (
        <div className="selected-icon-preview">
          <div className="preview-label">Selected icon</div>
          <div className="preview-content">
            {selectedDefinition ? (
              <RenderSerializedIcon definition={selectedDefinition} size={32} strokeWidth={1.5} />
            ) : (
              <SelectedIconFallback name={nameValue} />
            )}
            <span className="icon-name">{nameValue}</span>
            {!readOnly ? (
              <button
                className="clear-button"
                onClick={() => {
                  void setName('')
                }}
                type="button"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {showPicker && !readOnly ? (
        <div className="icon-picker-dropdown">
          <div className="dropdown-header">
            <span className="dropdown-count">
              {loading
                ? 'Loading icons…'
                : error
                  ? error
                  : `${filteredNames.length} icons${search.trim() ? ' matching' : ''}`}
            </span>
          </div>
          {!loading && !error ? (
            <div className="icon-grid">
              {filteredNames.map((name) => {
                const definition = definitions[name]
                return (
                  <button
                    className={`icon-option${nameValue === name ? ' selected' : ''}`}
                    key={name}
                    onClick={() => {
                      void setName(name)
                      void setProvider(PROVIDER)
                      setSearch('')
                      setShowPicker(false)
                    }}
                    title={name}
                    type="button"
                  >
                    {definition ? (
                      <RenderSerializedIcon definition={definition} size={24} strokeWidth={1.5} />
                    ) : (
                      <span className="icon-option-placeholder" />
                    )}
                    <span className="icon-option-name">{name}</span>
                  </button>
                )
              })}
              {filteredNames.length === 0 ? (
                <div className="no-results">No icons found matching &quot;{search}&quot;</div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {typeof field.admin?.description === 'string' ? (
        <FieldDescription
          className="field-description"
          description={field.admin.description}
          path={path}
        />
      ) : null}
    </div>
  )
}

function SelectedIconFallback({ name }: { name: string }) {
  const [definition, setDefinition] = useState<SerializedIcon | null>(null)

  useEffect(() => {
    let active = true
    void fetchDefinitions([name]).then((defs) => {
      if (active) setDefinition(defs[name] ?? null)
    })
    return () => {
      active = false
    }
  }, [name])

  if (!definition) return <span className="icon-option-placeholder" />
  return <RenderSerializedIcon definition={definition} size={32} strokeWidth={1.5} />
}
