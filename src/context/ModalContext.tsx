'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { AbstractModal } from '@/components/AbstractModal'

interface ModalContextType {
  selectedAbstract: any | null
  openAbstractModal: (abstract: any) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType>({
  selectedAbstract: null,
  openAbstractModal: () => {},
  closeModal: () => {},
})

export function useModal() {
  return useContext(ModalContext)
}

/**
 * Finds an abstract by code (exact or normalized) or by id fallback.
 */
export function findMatchingAbstract(abstracts: any[], param: string | null | undefined): any | null {
  if (!param || !Array.isArray(abstracts)) return null
  const cleanParam = decodeURIComponent(param).trim().toLowerCase()
  if (!cleanParam) return null

  // 1. Exact match by code (case-insensitive)
  const byCode = abstracts.find(
    (a) => a?.code && String(a.code).trim().toLowerCase() === cleanParam
  )
  if (byCode) return byCode

  // 2. Normalized match by code (strip spaces, hyphens, underscores)
  const normParam = cleanParam.replace(/[\s\-_]+/g, '')
  const byNormalizedCode = abstracts.find((a) => {
    if (!a?.code) return false
    const normCode = String(a.code).trim().toLowerCase().replace(/[\s\-_]+/g, '')
    return normCode === normParam
  })
  if (byNormalizedCode) return byNormalizedCode

  // 3. Fallback: match by ID
  const byId = abstracts.find((a) => a?.id && String(a.id).trim().toLowerCase() === cleanParam)
  if (byId) return byId

  return null
}

export function ModalProvider({
  children,
  allAbstracts = [],
}: {
  children: React.ReactNode
  allAbstracts?: any[]
}) {
  const [selectedAbstract, setSelectedAbstract] = useState<any | null>(null)
  const abstractsRef = useRef<any[]>(allAbstracts)

  // Keep ref updated if prop changes
  useEffect(() => {
    abstractsRef.current = allAbstracts
  }, [allAbstracts])

  // Open abstract and update browser history URL with ?abstract=<code|id>
  const openAbstractModal = useCallback((abstract: any) => {
    if (!abstract) return
    const codeOrId = abstract.code ? String(abstract.code).trim() : String(abstract.id)

    const url = new URL(window.location.href)
    url.searchParams.set('abstract', codeOrId)

    window.history.pushState(
      { modal: 'abstract', id: abstract.id, codeOrId },
      '',
      url.toString()
    )

    setSelectedAbstract(abstract)
  }, [])

  // Close modal and revert history/URL
  const closeModal = useCallback(() => {
    setSelectedAbstract(null)

    const params = new URLSearchParams(window.location.search)
    if (params.has('abstract')) {
      if (window.history.state?.modal === 'abstract') {
        window.history.back()
      } else {
        const cleanUrl = new URL(window.location.href)
        cleanUrl.searchParams.delete('abstract')
        window.history.replaceState({ modal: null }, '', cleanUrl.toString())
      }
    }
  }, [])

  // Handle mobile and desktop browser back/forward buttons
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const params = new URLSearchParams(window.location.search)
      const abstractParam = params.get('abstract')

      if (!abstractParam) {
        setSelectedAbstract(null)
      } else {
        const match = findMatchingAbstract(abstractsRef.current, abstractParam)
        if (match) {
          setSelectedAbstract(match)
        } else {
          // Fallback fetch if not present in memory
          fetchAbstractByQuery(abstractParam).then((res) => {
            if (res) setSelectedAbstract(res)
          })
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Initial load check: if URL already has ?abstract=... on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const abstractParam = params.get('abstract')
    if (!abstractParam) return

    const loadInitialAbstract = async () => {
      let match = findMatchingAbstract(abstractsRef.current, abstractParam)

      if (!match) {
        match = await fetchAbstractByQuery(abstractParam)
      }

      if (match) {
        // Set up history stack: base page without query, then push modal query
        // so that pressing mobile Back closes the modal and stays on page
        const cleanUrl = new URL(window.location.href)
        cleanUrl.searchParams.delete('abstract')
        window.history.replaceState({ modal: null }, '', cleanUrl.toString())

        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.set('abstract', abstractParam)
        window.history.pushState(
          { modal: 'abstract', id: match.id, codeOrId: abstractParam },
          '',
          currentUrl.toString()
        )

        setSelectedAbstract(match)
      }
    }

    loadInitialAbstract()
  }, [])

  return (
    <ModalContext.Provider value={{ selectedAbstract, openAbstractModal, closeModal }}>
      {children}
      <AbstractModal
        abstract={selectedAbstract}
        isOpen={Boolean(selectedAbstract)}
        onClose={closeModal}
      />
    </ModalContext.Provider>
  )
}

/**
 * Fetch abstract from Payload REST API if not found in initial bundle
 */
async function fetchAbstractByQuery(param: string): Promise<any | null> {
  try {
    const cleanParam = decodeURIComponent(param).trim()
    // 1. Try code query
    const res = await fetch(
      `/api/abstracts?where[code][equals]=${encodeURIComponent(cleanParam)}&depth=4`
    )
    if (res.ok) {
      const data = await res.json()
      if (data?.docs && data.docs.length > 0) {
        return data.docs[0]
      }
    }

    // 2. Try ID query
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
