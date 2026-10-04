'use client'

import React from 'react'
import {
  Mic,
  Users,
  Coffee,
  Utensils,
  Presentation,
  FlaskConical,
  BookOpen,
  Award,
  Video,
  Stethoscope,
  Dna,
  Activity,
  Calendar,
  Clock,
  MapPin,
  Info,
  MessageSquare,
  Music,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  X,
  ExternalLink,
  Building2,
  User,
  Sparkles,
} from 'lucide-react'
import { RenderSerializedIcon, type SerializedIcon } from '@/fields/icon/renderSerializedIcon'
import type { AgendaIconValue } from '@/utilities/conferenceUi'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  mic: Mic,
  users: Users,
  coffee: Coffee,
  utensils: Utensils,
  presentation: Presentation,
  'flask-conical': FlaskConical,
  'book-open': BookOpen,
  award: Award,
  video: Video,
  stethoscope: Stethoscope,
  dna: Dna,
  activity: Activity,
  calendar: Calendar,
  clock: Clock,
  'map-pin': MapPin,
  info: Info,
  'message-square': MessageSquare,
  music: Music,
  'check-circle': CheckCircle,
  sparkles: Sparkles,
  building: Building2,
  user: User,
}

function isSerializedIcon(value: unknown): value is SerializedIcon {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'viewBox' in value &&
      'nodes' in value &&
      Array.isArray((value as SerializedIcon).nodes),
  )
}

export function SessionIcon({
  name,
  className = 'w-5 h-5',
}: {
  name?: AgendaIconValue
  className?: string
}) {
  if (!name) return <Clock className={className} aria-hidden="true" />

  if (typeof name === 'object') {
    const definition =
      'definition' in name && isSerializedIcon(name.definition) ? name.definition : null
    if (definition) {
      return (
        <RenderSerializedIcon
          definition={definition}
          className={className}
          aria-hidden="true"
          size={16}
        />
      )
    }
    const lucideName = name.name
    if (lucideName) {
      const IconComponent = ICON_MAP[lucideName.toLowerCase()] || Clock
      return <IconComponent className={className} aria-hidden="true" />
    }
    return <Clock className={className} aria-hidden="true" />
  }

  const IconComponent = ICON_MAP[name.toLowerCase()] || Clock
  return <IconComponent className={className} aria-hidden="true" />
}

export {
  ChevronDown,
  ChevronRight,
  X,
  ExternalLink,
  Building2,
  User,
  Sparkles,
  MapPin,
  Clock,
  Calendar,
}
