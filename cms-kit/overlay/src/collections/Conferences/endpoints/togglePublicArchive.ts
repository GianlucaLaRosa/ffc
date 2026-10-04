import type { Endpoint } from 'payload'

type ToggleBody = {
  publicArchive?: boolean
}

export const togglePublicArchiveEndpoint: Endpoint = {
  path: '/:id/public-archive',
  method: 'patch',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const idParam = req.routeParams?.id
    const id =
      typeof idParam === 'string' || typeof idParam === 'number' ? idParam : null

    if (id == null) {
      return Response.json({ message: 'Conference id is required.' }, { status: 400 })
    }

    let body: ToggleBody = {}
    try {
      if (typeof req.json !== 'function') {
        return Response.json({ message: 'Invalid JSON body.' }, { status: 400 })
      }
      body = (await req.json()) as ToggleBody
    } catch {
      return Response.json({ message: 'Invalid JSON body.' }, { status: 400 })
    }

    if (typeof body.publicArchive !== 'boolean') {
      return Response.json({ message: 'publicArchive must be a boolean.' }, { status: 400 })
    }

    const existing = await req.payload.findByID({
      collection: 'conferences',
      id,
      depth: 0,
      draft: false,
      overrideAccess: false,
      req,
      select: {
        _status: true,
        publicArchive: true,
        slug: true,
        title: true,
        year: true,
      },
      user: req.user,
    })

    if (existing._status !== 'published') {
      return Response.json(
        { message: 'Only published conferences can be shown in the public archive.' },
        { status: 400 },
      )
    }

    const active = await req.payload.findGlobal({
      slug: 'active-conference',
      depth: 0,
      overrideAccess: false,
      req,
      select: {
        conference: true,
      },
      user: req.user,
    })

    const activeId =
      typeof active.conference === 'object' && active.conference !== null
        ? active.conference.id
        : active.conference

    if (activeId != null && String(activeId) === String(id)) {
      return Response.json(
        { message: 'The active conference is shown at the site root, not in the archive.' },
        { status: 400 },
      )
    }

    try {
      const doc = await req.payload.update({
        collection: 'conferences',
        id,
        data: {
          publicArchive: body.publicArchive,
        },
        depth: 0,
        draft: false,
        overrideAccess: false,
        req,
        select: {
          publicArchive: true,
          slug: true,
          title: true,
          year: true,
        },
        user: req.user,
      })

      return Response.json({
        doc: {
          id: doc.id,
          publicArchive: doc.publicArchive,
          slug: doc.slug,
          title: doc.title,
          year: doc.year,
        },
      })
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message?: unknown }).message)
          : 'Failed to update public archive.'

      req.payload.logger.error({
        err: error,
        msg: `Failed to toggle public archive for conference ${id}`,
      })

      return Response.json({ message }, { status: 400 })
    }
  },
}
