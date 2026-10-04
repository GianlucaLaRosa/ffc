import type { PageMapItem } from 'nextra'

function isDocsRoute(route: string): boolean {
  return route === '/docs' || route.startsWith('/docs/')
}

/** Nextra also indexes App Router pages; keep only the editor handbook. */
export function filterDocsPageMap(items: PageMapItem[]): PageMapItem[] {
  return items.flatMap((item) => {
    if ('data' in item && item.data && 'primo-accesso' in item.data) {
      return [item]
    }

    if ('route' in item && typeof item.route === 'string' && !('children' in item)) {
      return isDocsRoute(item.route) ? [item] : []
    }

    if ('children' in item && Array.isArray(item.children)) {
      const children = filterDocsPageMap(item.children)
      if (children.length === 0) return []
      // Flatten the /docs folder so the sidebar is a single list, not “Docs > pages”.
      return children
    }

    return []
  })
}
