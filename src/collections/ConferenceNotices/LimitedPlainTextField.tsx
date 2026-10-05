'use client'

import type { TextareaFieldClientComponent, TextFieldClientComponent, Validate } from 'payload'
import { TextareaInput, TextInput, useField } from '@payloadcms/ui'
import { useEffect, type ChangeEvent } from 'react'

const clamp = (value: string, max: number) => (value.length > max ? value.slice(0, max) : value)

const CharacterCount = ({ current, max }: { current: number; max: number }) => (
  <p
    style={{
      color: 'var(--theme-elevation-500)',
      fontSize: 12,
      margin: '4px 0 0',
    }}
  >
    {current} / {max}
  </p>
)

export const LimitedTextField: TextFieldClientComponent = (props) => {
  const {
    field: {
      admin: { autoComplete, className, description, placeholder } = {},
      label,
      localized,
      maxLength = 40,
      required,
    },
    inputRef,
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    setValue,
    showError,
    value,
  } = useField<string>({
    potentiallyStalePath: pathFromProps,
    validate: validate as Validate | undefined,
  })

  const text = typeof value === 'string' ? value : ''

  return (
    <TextInput
      AfterInput={
        <>
          <CharacterCount current={text.length} max={maxLength} />
          {AfterInput}
        </>
      }
      BeforeInput={BeforeInput}
      className={className}
      Description={Description}
      description={description}
      Error={Error}
      htmlAttributes={{ autoComplete: autoComplete || undefined, maxLength } as never}
      inputRef={inputRef}
      Label={Label}
      label={label}
      localized={localized}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        setValue(clamp(event.target.value, maxLength))
      }
      path={path}
      placeholder={placeholder}
      readOnly={readOnly || disabled}
      required={required}
      showError={showError}
      value={text}
    />
  )
}

export const LimitedTextareaField: TextareaFieldClientComponent = (props) => {
  const {
    field: {
      admin: { className, description, placeholder, rows } = {},
      label,
      localized,
      maxLength = 120,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    setValue,
    showError,
    value,
  } = useField<string>({
    potentiallyStalePath: pathFromProps,
    validate: validate as Validate | undefined,
  })

  const text = typeof value === 'string' ? value : ''
  const fieldId = `field-${path.replace(/\./g, '__')}`

  useEffect(() => {
    const el = document.getElementById(fieldId)
    if (el instanceof HTMLTextAreaElement) el.maxLength = maxLength
  }, [fieldId, maxLength])

  return (
    <TextareaInput
      AfterInput={
        <>
          <CharacterCount current={text.length} max={maxLength} />
          {AfterInput}
        </>
      }
      BeforeInput={BeforeInput}
      className={className}
      Description={Description}
      description={description}
      Error={Error}
      Label={Label}
      label={label}
      localized={localized}
      onChange={(event) => setValue(clamp(event.target.value, maxLength))}
      path={path}
      placeholder={typeof placeholder === 'string' ? placeholder : undefined}
      readOnly={readOnly || disabled}
      required={required}
      rows={rows}
      showError={showError}
      value={text}
    />
  )
}
