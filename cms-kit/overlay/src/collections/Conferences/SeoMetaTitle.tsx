'use client'

import {
  FieldLabel,
  TextInput,
  useConfig,
  useDocumentInfo,
  useDocumentTitle,
  useField,
  useForm,
  useTranslation,
} from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React, { useCallback } from 'react'

import { conferenceSeoGenerateBody } from './conferenceSeoGenerateBody'

export const SeoMetaTitle: React.FC<{
  field: {
    label?: Record<string, string> | string
    localized?: boolean
    maxLength?: number
    minLength?: number
    required?: boolean
  }
  hasGenerateTitleFn?: boolean
  readOnly?: boolean
}> = (props) => {
  const {
    field: { label, localized, required },
    hasGenerateTitleFn,
    readOnly,
  } = props
  const { t } = useTranslation()
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const {
    customComponents: { AfterInput, BeforeInput, Label } = {},
    errorMessage,
    path,
    setValue,
    showError,
    value,
  } = useField<string>()
  const { getData } = useForm()
  const docInfo = useDocumentInfo()
  const { title } = useDocumentTitle()

  const regenerateTitle = useCallback(async () => {
    if (!hasGenerateTitleFn) return

    const endpoint = formatAdminURL({
      apiRoute: api,
      path: '/plugin-seo/generate-title',
    })

    const genTitleResponse = await fetch(endpoint, {
      body: JSON.stringify(
        conferenceSeoGenerateBody({
          collectionSlug: docInfo.collectionSlug,
          doc: getData() as Record<string, unknown>,
          id: docInfo.id,
          title,
        }),
      ),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })

    const json: { result?: string } = await genTitleResponse.json()
    if (!genTitleResponse.ok) return
    setValue(json.result || '')
  }, [
    api,
    docInfo.collectionSlug,
    docInfo.id,
    getData,
    hasGenerateTitleFn,
    setValue,
    title,
  ])

  return (
    <div style={{ marginBottom: '20px' }}>
      <div className="plugin-seo__field">
        {Label ?? (
          <FieldLabel label={label} localized={localized} path={path} required={required} />
        )}
        {hasGenerateTitleFn && (
          <>
            {' — '}
            <button
              disabled={readOnly}
              onClick={() => {
                void regenerateTitle()
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'currentcolor',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
              type="button"
            >
              {t('plugin-seo:autoGenerate')}
            </button>
          </>
        )}
      </div>
      <TextInput
        AfterInput={AfterInput}
        BeforeInput={BeforeInput}
        Error={errorMessage}
        onChange={setValue}
        path={path}
        readOnly={readOnly}
        required={required}
        showError={showError}
        style={{ marginBottom: 0 }}
        value={value}
      />
    </div>
  )
}
