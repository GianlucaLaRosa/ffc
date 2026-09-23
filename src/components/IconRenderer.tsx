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

export function SessionIcon({
  name,
  className = 'w-5 h-5',
}: {
  name?: string | null
  className?: string
}) {
  if (!name) return <Clock className={className} aria-hidden="true" />
  const IconComponent = ICON_MAP[name.toLowerCase()] || Clock
  return <IconComponent className={className} aria-hidden="true" />
}

export { ChevronDown, ChevronRight, X, ExternalLink, Building2, User, Sparkles, MapPin, Clock, Calendar }
