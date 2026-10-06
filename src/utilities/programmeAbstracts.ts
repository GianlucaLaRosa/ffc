import type { Payload, PayloadRequest } from 'payload'

import type { Abstract, AgendaItem, ConferenceDay } from '@/payload-types'
import { relationId } from '@/utilities/conferenceRoutes'
import { joinDocIds, joinDocs } from '@/utilities/conferenceUi'

function childOrderKey(item: AgendaItem): string {
  const order = item['_agenda-items_children_order']
  return typeof order === 'string' ? order : ''
}

function withHydratedChildren(
  item: AgendaItem,
  fullById: Map<string, AgendaItem>,
  childrenByParent: Map<string, AgendaItem[]>,
): AgendaItem {
  const full = fullById.get(String(item.id)) ?? item
  const children = (childrenByParent.get(String(full.id)) ?? []).map((child) =>
    withHydratedChildren(child, fullById, childrenByParent),
  )

  return {
    ...full,
    children: {
      docs: children,
      hasNextPage: false,
      totalDocs: children.length,
    },
  }
}

/**
 * Join-populated agenda items omit `name` (rich title) via `defaultPopulate`.
 * Reload published items for these days and rebuild the tree.
 */
export async function hydrateProgrammeAgenda({
  payload,
  days,
  req,
}: {
  payload: Payload
  days: ConferenceDay[]
  req?: PayloadRequest
}): Promise<ConferenceDay[]> {
  const dayIds = days.map((day) => day.id)
  if (dayIds.length === 0) return days

  const { docs } = await payload.find({
    collection: 'agenda-items',
    where: {
      and: [{ day: { in: dayIds } }, { _status: { equals: 'published' } }],
    },
    depth: 0,
    draft: false,
    limit: 1000,
    pagination: false,
    overrideAccess: true,
    req,
  })

  const fullById = new Map(docs.map((doc) => [String(doc.id), doc as AgendaItem]))
  const childrenByParent = new Map<string, AgendaItem[]>()

  for (const doc of docs) {
    const item = doc as AgendaItem
    const parentId = relationId(item.parent)
    if (parentId == null) continue
    const key = String(parentId)
    const list = childrenByParent.get(key)
    if (list) list.push(item)
    else childrenByParent.set(key, [item])
  }

  for (const list of childrenByParent.values()) {
    list.sort((a, b) => childOrderKey(a).localeCompare(childOrderKey(b)))
  }

  return days.map((day) => {
    const roots = joinDocIds(day.agendaItems)
      .map((id) => fullById.get(id))
      .filter((item): item is AgendaItem => Boolean(item))
      .map((item) => withHydratedChildren(item, fullById, childrenByParent))

    return {
      ...day,
      agendaItems: {
        ...day.agendaItems,
        docs: roots,
        hasNextPage: false,
        totalDocs: roots.length,
      },
    }
  })
}

function abstractsForAgendaItem(
  item: AgendaItem,
  abstractsById: Map<string, Abstract>,
  abstractsByAgendaItemId: Map<string, Abstract[]>,
): Abstract[] {
  const ordered = joinDocIds(item.childAbstracts)
    .map((id) => abstractsById.get(id))
    .filter((doc): doc is Abstract => Boolean(doc))
  const fallback = abstractsByAgendaItemId.get(String(item.id)) ?? []
  if (ordered.length === 0) return fallback

  const seen = new Set(ordered.map((doc) => String(doc.id)))
  return [...ordered, ...fallback.filter((doc) => !seen.has(String(doc.id)))]
}

function attachToAgendaItem(
  item: AgendaItem,
  abstractsById: Map<string, Abstract>,
  abstractsByAgendaItemId: Map<string, Abstract[]>,
): AgendaItem {
  const linked = abstractsForAgendaItem(item, abstractsById, abstractsByAgendaItemId)
  const children = joinDocs<AgendaItem>(item.children).map((child) =>
    attachToAgendaItem(child, abstractsById, abstractsByAgendaItemId),
  )

  return {
    ...item,
    childAbstracts: {
      docs: linked,
      hasNextPage: false,
      totalDocs: linked.length,
    },
    children: {
      ...item.children,
      docs: children,
    },
  }
}

/** Attach published abstracts onto each programme item (join docs are often ids-only or truncated). */
export function attachProgrammeAbstracts(
  days: ConferenceDay[],
  abstracts: Abstract[],
): ConferenceDay[] {
  const abstractsById = new Map(abstracts.map((abs) => [String(abs.id), abs]))
  const abstractsByAgendaItemId = new Map<string, Abstract[]>()

  for (const abs of abstracts) {
    const refs = Array.isArray(abs.agendaItems) ? abs.agendaItems : []
    for (const ref of refs) {
      const id = relationId(ref)
      if (id == null) continue
      const key = String(id)
      const list = abstractsByAgendaItemId.get(key)
      if (list) list.push(abs)
      else abstractsByAgendaItemId.set(key, [abs])
    }
  }

  return days.map((day) => ({
    ...day,
    agendaItems: {
      ...day.agendaItems,
      docs: joinDocs<AgendaItem>(day.agendaItems).map((item) =>
        attachToAgendaItem(item, abstractsById, abstractsByAgendaItemId),
      ),
    },
  }))
}
