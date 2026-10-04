export const generateConferenceIntroPreviewPath = ({
  slug,
}: {
  slug?: string | null
}): string | null => {
  if (!slug) return null

  const encodedParams = new URLSearchParams({
    path: `/preview/intro/${encodeURIComponent(slug)}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  return `/next/preview?${encodedParams.toString()}`
}
