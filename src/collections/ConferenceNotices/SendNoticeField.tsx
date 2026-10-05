'use client'

import type { UIFieldClientComponent } from 'payload'
import { Button, toast, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import React, { useState } from 'react'

export const SendNoticeField: UIFieldClientComponent = () => {
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
        <p style={{ margin: 0, color: 'var(--theme-elevation-600)' }}>
          Salvate l’avviso una prima volta, poi usate Invia push per le notifiche a schermo bloccato.
        </p>
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
          Push già inviata
          {typeof pushSent === 'number' ? ` a ${pushSent} dispositivo/i` : ''}.
          <br />
          <span style={{ color: 'var(--theme-elevation-600)' }}>
            {when}. Create un nuovo avviso se serve un altro messaggio.
          </span>
        </p>
      </div>
    )
  }

  if (!sendPush) {
    return (
      <div className="field-type">
        <p style={{ margin: 0, color: 'var(--theme-elevation-600)' }}>
          Solo banner sul sito: accendete <strong>Show site banner</strong> e salvate. Accendete{' '}
          <strong>Include push when sending</strong> se volete anche una notifica a schermo bloccato.
        </p>
      </div>
    )
  }

  const onSend = async () => {
    const label = title || 'questo avviso'
    const confirmed = window.confirm(
      `Inviare la push per «${label}»? Arriva ai dispositivi iscritti della Conferenza attiva e non si può annullare.`,
    )
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
        throw new Error(data?.message || 'Invio push non riuscito')
      }

      toast.success(
        `Push inviata a ${data?.sent ?? 0} dispositivo/i` +
          (data?.skipped ? ` (${data.skipped} saltati)` : '') +
          (data?.removed ? `, rimossi ${data.removed} scaduti` : ''),
      )
      window.location.reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invio push non riuscito')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="field-type">
      <p style={{ margin: '0 0 0.75rem', color: 'var(--theme-elevation-600)' }}>
        Salvate prima eventuali modifiche. Invia recapita una notifica a schermo bloccato una sola volta. Il banner
        sul sito compare appena <strong>Show site banner</strong> è acceso e salvate.
      </p>
      <Button buttonStyle="primary" disabled={pending} onClick={() => void onSend()}>
        {pending ? 'Invio…' : 'Invia push'}
      </Button>
    </div>
  )
}
