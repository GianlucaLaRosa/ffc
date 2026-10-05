'use client'

import type { UIFieldClientComponent } from 'payload'
import { Button, toast, useDocumentInfo, useFormFields, useTranslation } from '@payloadcms/ui'
import React, { useState } from 'react'
import { asT } from '@/i18n/asT'

export const SendNoticeField: UIFieldClientComponent = () => {
  const { t } = useTranslation()
  const { id } = useDocumentInfo()
  const sendPush = useFormFields(([fields]) => Boolean(fields.sendPush?.value))
  const sentAt = useFormFields(([fields]) => fields.sentAt?.value)
  const pushSent = useFormFields(([fields]) => fields.pushSent?.value)
  const title = useFormFields(([fields]) =>
    typeof fields.title?.value === 'string' ? fields.title.value.trim() : '',
  )
  const [pending, setPending] = useState(false)

  if (id == null) {
    return (
      <div className="field-type">
        <p style={{ margin: 0, color: 'var(--theme-elevation-600)' }}>{asT(t)('fcr:sendSaveFirst')}</p>
      </div>
    )
  }

  if (sentAt) {
    const when =
      typeof sentAt === 'string'
        ? sentAt
        : sentAt instanceof Date
          ? sentAt.toISOString()
          : String(sentAt)
    return (
      <div className="field-type">
        <p style={{ margin: 0 }}>
          {asT(t)('fcr:sendAlreadySent')}
          {typeof pushSent === 'number' ? asT(t)('fcr:sendAlreadySentTo', { count: pushSent }) : ''}
          <br />
          <span style={{ color: 'var(--theme-elevation-600)' }}>
            {when}. {asT(t)('fcr:sendCreateAnother')}
          </span>
        </p>
      </div>
    )
  }

  if (!sendPush) {
    return (
      <div className="field-type">
        <p style={{ margin: 0, color: 'var(--theme-elevation-600)' }}>{asT(t)('fcr:sendBannerOnly')}</p>
      </div>
    )
  }

  const onSend = async () => {
    const label = title || asT(t)('fcr:sendUntitled')
    const confirmed = window.confirm(asT(t)('fcr:sendConfirm', { label }))
    if (!confirmed) return

    setPending(true)
    try {
      const res = await fetch(`/api/conference-notices/${id}/send`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = (await res.json().catch(() => null)) as {
        message?: string
        sent?: number
        removed?: number
        skipped?: number
      } | null

      if (!res.ok) {
        throw new Error(data?.message || asT(t)('fcr:sendFailed'))
      }

      toast.success(
        asT(t)('fcr:sendSuccess', { sent: data?.sent ?? 0 }) +
          (data?.skipped ? asT(t)('fcr:sendSkipped', { count: data.skipped }) : '') +
          (data?.removed ? asT(t)('fcr:sendRemoved', { count: data.removed }) : ''),
      )
      window.location.reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : asT(t)('fcr:sendFailed'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="field-type">
      <p style={{ margin: '0 0 0.75rem', color: 'var(--theme-elevation-600)' }}>{asT(t)('fcr:sendHint')}</p>
      <Button buttonStyle="primary" disabled={pending} onClick={() => void onSend()}>
        {pending ? asT(t)('fcr:sending') : asT(t)('fcr:sendButton')}
      </Button>
    </div>
  )
}
