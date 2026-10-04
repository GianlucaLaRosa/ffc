export const conferenceSeoGenerateBody = ({
  collectionSlug,
  doc,
  id,
  title,
}: {
  collectionSlug?: string | null
  doc: Record<string, unknown>
  id?: number | string | null
  title?: string
}) => {
  const meta =
    doc.meta && typeof doc.meta === 'object' ? (doc.meta as Record<string, unknown>) : {}
  const image = meta.image
  const imageId =
    image && typeof image === 'object' && image !== null && 'id' in image
      ? (image as { id: number | string }).id
      : image

  return {
    collectionSlug,
    doc: {
      city: doc.city,
      country: doc.country,
      id: doc.id,
      meta: {
        description: meta.description,
        image: imageId,
        title: meta.title,
      },
      publicArchive: doc.publicArchive,
      slug: doc.slug,
      title: doc.title,
      year: doc.year,
    },
    id,
    title: title || (typeof doc.title === 'string' ? doc.title : undefined),
  }
}
