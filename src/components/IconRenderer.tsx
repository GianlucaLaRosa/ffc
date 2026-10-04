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
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Building2,
  User,
  Sparkles,
  FileText,
  icons,
  type LucideIcon,
} from 'lucide-react'
import { RenderSerializedIcon, type SerializedIcon } from '@/fields/icon/renderSerializedIcon'
import type { AgendaIconValue } from '@/utilities/conferenceUi'

const ICON_ALIASES: Record<string, LucideIcon> = {
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
  'file-text': FileText,
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

function toPascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
}

function lucideFromName(name: string): LucideIcon {
  const alias = ICON_ALIASES[name.toLowerCase()]
  if (alias) return alias
  const fromSet = (icons as Record<string, LucideIcon | undefined>)[toPascalCase(name)]
  return fromSet ?? Clock
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
      const IconComponent = lucideFromName(lucideName)
      return <IconComponent className={className} aria-hidden="true" />
    }
    return <Clock className={className} aria-hidden="true" />
  }

  const IconComponent = lucideFromName(name)
  return <IconComponent className={className} aria-hidden="true" />
}

export {
  ChevronDown,
  ChevronLeft,
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
