'use client'

import {
  useConfig,
  useDocumentInfo,
  useDocumentTitle,
  useForm,
  useTranslation,
} from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React, { useEffect, useState } from 'react'

import { conferenceSeoGenerateBody } from './conferenceSeoGenerateBody'

export const SeoPreview: React.FC<{
  descriptionPath?: string
  hasGenerateURLFn?: boolean
  titlePath?: string
}> = ({
  descriptionPath = 'meta.description',
  hasGenerateURLFn,
  titlePath = 'meta.title',
}) => {
  const { t } = useTranslation()
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const { getData } = useForm()
  const docInfo = useDocumentInfo()
  const { title } = useDocumentTitle()
  const [href, setHref] = useState<string>()
  const data = getData() as Record<string, unknown>
  const meta = data.meta && typeof data.meta === 'object' ? (data.meta as Record<string, unknown>) : {}
  const metaTitle =
    titlePath === 'meta.title'
      ? (typeof meta.title === 'string' ? meta.title : '')
      : ''
  const metaDescription =
    descriptionPath === 'meta.description'
      ? (typeof meta.description === 'string' ? meta.description : '')
      : ''

  const getDataRef = React.useRef(getData)
  getDataRef.current = getData

  useEffect(() => {
    if (!hasGenerateURLFn) return

    const endpoint = formatAdminURL({
      apiRoute: api,
      path: '/plugin-seo/generate-url',
    })

    const run = async () => {
      const res = await fetch(endpoint, {
        body: JSON.stringify(
          conferenceSeoGenerateBody({
            collectionSlug: docInfo.collectionSlug,
            doc: getDataRef.current() as Record<string, unknown>,
            id: docInfo.id,
            title,
          }),
        ),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (!res.ok) return
      const json: { result?: string } = await res.json()
      if (json.result) setHref(json.result)
    }

    void run()
  }, [api, docInfo.collectionSlug, docInfo.id, hasGenerateURLFn, metaDescription, metaTitle, title])

  return (
    <div style={{ marginBottom: '20px' }}>
      <div>{t('plugin-seo:preview')}</div>
      <div
        style={{
          background: 'var(--theme-elevation-50)',
          borderRadius: '5px',
          marginTop: '8px',
          maxWidth: '600px',
          padding: '20px',
          pointerEvents: 'none',
        }}
      >
        <div>
          <a href={href} style={{ textDecoration: 'none' }}>
            {href || 'https://...'}
          </a>
        </div>
        <h4 style={{ margin: 0 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            {metaTitle}
          </a>
        </h4>
        <p style={{ margin: 0 }}>{metaDescription}</p>
      </div>
    </div>
  )
}
