import type { Abstract, AgendaItem, ConferenceDay } from '@/payload-types'
import { relationId } from '@/utilities/conferenceRoutes'
import { joinDocIds, joinDocs } from '@/utilities/conferenceUi'

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
