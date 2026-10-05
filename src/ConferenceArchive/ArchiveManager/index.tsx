'use client'

import type { UIFieldClientComponent } from 'payload'
import { CheckboxInput, toast } from '@payloadcms/ui'
import React, { useCallback, useEffect, useState } from 'react'

import './index.scss'

type ArchiveConference = {
  id: number | string
  publicArchive?: boolean | null
  slug?: string | null
  title?: string | null
  year?: number | null
}

const baseClass = 'conference-archive-manager'

export const ArchiveManager: UIFieldClientComponent = () => {
  const [conferences, setConferences] = useState<ArchiveConference[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    setLoading(true)

    try {
      const activeRes = await fetch(
        '/api/globals/active-conference?depth=0&select[conference]=true',
      )
      if (!activeRes.ok) throw new Error('Impossibile caricare la conferenza attiva')

      const activeData = (await activeRes.json()) as {
        conference?: number | string | { id: number | string } | null
      }

      const activeId =
        typeof activeData.conference === 'object' && activeData.conference !== null
          ? activeData.conference.id
          : activeData.conference

      const params = new URLSearchParams({
        depth: '0',
        draft: 'false',
        limit: '1000',
        pagination: 'false',
        sort: '-year',
        'where[_status][equals]': 'published',
        'select[title]': 'true',
        'select[slug]': 'true',
        'select[year]': 'true',
        'select[publicArchive]': 'true',
      })

      if (activeId != null) {
        params.set('where[id][not_equals]', String(activeId))
      }

      const res = await fetch(`/api/conferences?${params.toString()}`)
      if (!res.ok) throw new Error('Impossibile caricare le conferenze')

      const data = (await res.json()) as { docs?: ArchiveConference[] }
      const docs = Array.isArray(data.docs) ? [...data.docs] : []

      docs.sort((a, b) => {
        const yearDiff = (b.year ?? 0) - (a.year ?? 0)
        if (yearDiff !== 0) return yearDiff
        return String(a.title ?? '').localeCompare(String(b.title ?? ''))
      })

      setConferences(docs)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossibile caricare l’elenco archivio')
      setConferences([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const setPending = (id: string | number, pending: boolean) => {
    setPendingIds((current) => {
      const next = new Set(current)
      const key = String(id)
      if (pending) next.add(key)
      else next.delete(key)
      return next
    })
  }

  const onToggle = async (conference: ArchiveConference, checked: boolean) => {
    setPending(conference.id, true)

    setConferences((current) =>
      current.map((item) =>
        String(item.id) === String(conference.id) ? { ...item, publicArchive: checked } : item,
      ),
    )

    try {
      const res = await fetch(`/api/conferences/${conference.id}/public-archive`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicArchive: checked }),
      })

      if (!res.ok) {
        const errorData = (await res.json().catch(() => null)) as { message?: string } | null
        throw new Error(errorData?.message || 'Aggiornamento archivio pubblico non riuscito')
      }

      const data = (await res.json()) as { doc?: ArchiveConference }
      if (data.doc) {
        setConferences((current) =>
          current.map((item) =>
            String(item.id) === String(conference.id)
              ? { ...item, publicArchive: data.doc?.publicArchive ?? checked }
              : item,
          ),
        )
      }

      toast.success(
        checked
          ? `${conference.title ?? 'Conferenza'} è pubblica su /archive/${conference.slug}`
          : `${conference.title ?? 'Conferenza'} tolta dall’archivio pubblico`,
      )
    } catch (error) {
      setConferences((current) =>
        current.map((item) =>
          String(item.id) === String(conference.id)
            ? { ...item, publicArchive: conference.publicArchive }
            : item,
        ),
      )
      toast.error(error instanceof Error ? error.message : 'Aggiornamento archivio pubblico non riuscito')
    } finally {
      setPending(conference.id, false)
    }
  }

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__intro`}>
        <h2 className={`${baseClass}__title`}>Archivio pubblico</h2>
        <p className={`${baseClass}__description`}>
          Edizioni pubblicate del passato, esclusa quella in home. Una riga spuntata è pubblica su{' '}
          <code>/archive/{'{slug}'}</code>. Non spuntata resta solo nel CMS. La conferenza attiva
          non compare qui.
        </p>
      </div>

      {loading ? (
        <p className={`${baseClass}__status`}>Caricamento conferenze…</p>
      ) : conferences.length === 0 ? (
        <p className={`${baseClass}__status`}>
          Nessuna edizione passata pubblicata. Create e pubblicate un’altra edizione, oppure cambiate la
          conferenza attiva.
        </p>
      ) : (
        <ul className={`${baseClass}__list`}>
          {conferences.map((conference) => {
            const pending = pendingIds.has(String(conference.id))
            const checked = Boolean(conference.publicArchive)
            const inputId = `public-archive-${conference.id}`

            return (
              <li className={`${baseClass}__row`} key={conference.id}>
                <CheckboxInput
                  checked={checked}
                  id={inputId}
                  label={conference.title || `Conference ${conference.id}`}
                  name={inputId}
                  onToggle={(event) => {
                    void onToggle(conference, event.target.checked)
                  }}
                  readOnly={pending}
                />
                <div className={`${baseClass}__meta`}>
                  <span className={`${baseClass}__year`}>{conference.year ?? '—'}</span>
                  {conference.slug ? (
                    <code className={`${baseClass}__slug`}>/archive/{conference.slug}</code>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
