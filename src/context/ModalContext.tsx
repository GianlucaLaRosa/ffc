'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AbstractModal } from '@/components/AbstractModal'
import { abstractGallerySlides } from '@/utilities/conferenceUi'
import {
  abstractOverlayId,
  clampPhotoIndex,
  overlayWasPushed,
  pushOverlay,
  readOverlayQuery,
  replaceOverlay,
  type OverlayQuery,
} from '@/utilities/overlayUrl'
import type { Abstract } from '@/payload-types'

interface ModalContextType {
  selectedAbstract: Abstract | null
  photoIndex: number | null
  openAbstractModal: (abstract: Abstract) => void
  openPhotoOverlay: (index0: number) => void
  setPhotoOverlayIndex: (index0: number) => void
  closeTopOverlay: () => void
}

const ModalContext = createContext<ModalContextType>({
  selectedAbstract: null,
  photoIndex: null,
  openAbstractModal: () => {},
  openPhotoOverlay: () => {},
  setPhotoOverlayIndex: () => {},
  closeTopOverlay: () => {},
})

export function useModal() {
  return useContext(ModalContext)
}

/**
 * Finds an abstract by code (exact or normalized) or by id fallback.
 */
export function findMatchingAbstract(
  abstracts: Abstract[],
  param: string | null | undefined,
): Abstract | null {
  if (!param || !Array.isArray(abstracts)) return null
  const cleanParam = decodeURIComponent(param).trim().toLowerCase()
  if (!cleanParam) return null

  const byCode = abstracts.find(
    (a) => a?.code && String(a.code).trim().toLowerCase() === cleanParam,
  )
  if (byCode) return byCode

  const normParam = cleanParam.replace(/[\s\-_]+/g, '')
  const byNormalizedCode = abstracts.find((a) => {
    if (!a?.code) return false
    const normCode = String(a.code).trim().toLowerCase().replace(/[\s\-_]+/g, '')
    return normCode === normParam
  })
  if (byNormalizedCode) return byNormalizedCode

  const byId = abstracts.find((a) => a?.id && String(a.id).trim().toLowerCase() === cleanParam)
  if (byId) return byId

  return null
}

export function ModalProvider({
  children,
  allAbstracts = [],
}: {
  children: React.ReactNode
  allAbstracts?: Abstract[]
}) {
  const [selectedAbstract, setSelectedAbstract] = useState<Abstract | null>(null)
  const [photoIndex, setPhotoIndex] = useState<number | null>(null)
  const abstractsRef = useRef<Abstract[]>(allAbstracts)
  const selectedRef = useRef<Abstract | null>(null)

  useEffect(() => {
    abstractsRef.current = allAbstracts
  }, [allAbstracts])

  useEffect(() => {
    selectedRef.current = selectedAbstract
  }, [selectedAbstract])

  const applyQuery = useCallback(async (query: OverlayQuery) => {
    if (!query.abstract) {
      setSelectedAbstract(null)
      setPhotoIndex(null)
      return
    }

    let match = findMatchingAbstract(abstractsRef.current, query.abstract)
    if (!match) {
      match = await fetchAbstractByQuery(query.abstract)
    }
    if (!match) {
      setSelectedAbstract(null)
      setPhotoIndex(null)
      return
    }

    setSelectedAbstract(match)
    const slides = abstractGallerySlides(match)
    const photo1 = clampPhotoIndex(query.photo, slides.length)
    setPhotoIndex(photo1 == null ? null : photo1 - 1)

    if (query.photo != null && photo1 !== query.photo) {
      replaceOverlay({ abstract: abstractOverlayId(match), photo: photo1 })
    }
  }, [])

  const openAbstractModal = useCallback((abstract: Abstract) => {
    if (!abstract) return
    const full =
      abstractsRef.current.find((doc) => String(doc.id) === String(abstract.id)) ?? abstract
    const codeOrId = abstractOverlayId(full)
    const current = readOverlayQuery()
    if (current.abstract === codeOrId && current.photo == null) {
      setSelectedAbstract(full)
      setPhotoIndex(null)
      return
    }
    pushOverlay({ abstract: codeOrId, photo: null })
    setSelectedAbstract(full)
    setPhotoIndex(null)
  }, [])

  const openPhotoOverlay = useCallback((index0: number) => {
    const abstract = selectedRef.current
    if (!abstract) return
    const slides = abstractGallerySlides(abstract)
    if (slides.length === 0) return
    const next0 = ((index0 % slides.length) + slides.length) % slides.length
    const current = readOverlayQuery()
    const nextQuery = { abstract: abstractOverlayId(abstract), photo: next0 + 1 }
    if (current.photo == null) {
      pushOverlay(nextQuery)
    } else {
      replaceOverlay(nextQuery)
    }
    setPhotoIndex(next0)
  }, [])

  const setPhotoOverlayIndex = useCallback((index0: number) => {
    const abstract = selectedRef.current
    if (!abstract) return
    const slides = abstractGallerySlides(abstract)
    if (slides.length === 0) return
    const next0 = ((index0 % slides.length) + slides.length) % slides.length
    replaceOverlay({ abstract: abstractOverlayId(abstract), photo: next0 + 1 })
    setPhotoIndex(next0)
  }, [])

  const closeTopOverlay = useCallback(() => {
    const current = readOverlayQuery()
    if (!current.abstract && current.photo == null) {
      setSelectedAbstract(null)
      setPhotoIndex(null)
      return
    }

    if (overlayWasPushed()) {
      window.history.back()
      return
    }

    const next: OverlayQuery = current.photo
      ? { abstract: current.abstract, photo: null }
      : { abstract: null, photo: null }
    replaceOverlay(next)
    void applyQuery(next)
  }, [applyQuery])

  useEffect(() => {
    const handlePopState = () => {
      void applyQuery(readOverlayQuery())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [applyQuery])

  useEffect(() => {
    void applyQuery(readOverlayQuery())
  }, [applyQuery])

  return (
    <ModalContext.Provider
      value={{
        selectedAbstract,
        photoIndex,
        openAbstractModal,
        openPhotoOverlay,
        setPhotoOverlayIndex,
        closeTopOverlay,
      }}
    >
      {children}
      <AbstractModal
        abstract={selectedAbstract}
        photoIndex={photoIndex}
        isOpen={Boolean(selectedAbstract)}
        onClose={closeTopOverlay}
        onOpenPhoto={openPhotoOverlay}
        onPhotoIndexChange={setPhotoOverlayIndex}
      />
    </ModalContext.Provider>
  )
}

async function fetchAbstractByQuery(param: string): Promise<Abstract | null> {
  try {
    const cleanParam = decodeURIComponent(param).trim()
    const res = await fetch(
      `/api/abstracts?where[code][equals]=${encodeURIComponent(cleanParam)}&depth=4`,
    )
    if (res.ok) {
      const data = await res.json()
      if (data?.docs && data.docs.length > 0) {
        return data.docs[0]
      }
    }

    const resId = await fetch(`/api/abstracts/${encodeURIComponent(cleanParam)}?depth=4`)
    if (resId.ok) {
      const doc = await resId.json()
      if (doc?.id) return doc
    }
  } catch (error) {
    console.error('Failed to fetch abstract by query:', error)
  }
  return null
}
