import canUseDOM from './canUseDOM'

const stripTrailingSlash = (url: string) => url.replace(/\/$/, '')

const isLocalhostUrl = (url: string): boolean => {
  try {
    const { hostname } = new URL(url)
    return hostname === 'localhost' || hostname === '127.0.0.1'
  } catch {
    return false
  }
}

/** Public origin for Payload, SEO, and server-side links. */
export const getServerSideURL = (): string => {
  const explicit = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : ''
  const vercelDeployment = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''

  if (process.env.VERCEL) {
    if (explicit && !isLocalhostUrl(explicit)) return stripTrailingSlash(explicit)
    if (vercelProduction) return stripTrailingSlash(vercelProduction)
    if (vercelDeployment) return stripTrailingSlash(vercelDeployment)
  }

  return stripTrailingSlash(explicit || vercelProduction || vercelDeployment || 'http://localhost:3101')
}

export const getClientSideURL = (): string => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  return getServerSideURL()
}
