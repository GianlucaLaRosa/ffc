import type { Endpoint } from 'payload'
import { asT } from '@/i18n/asT'

type ToggleBody = {
  enablePublicArchive?: boolean
}

export const toggleEnablePublicArchiveEndpoint: Endpoint = {
  path: '/enable-public-archive',
  method: 'patch',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
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

    if (typeof body.enablePublicArchive !== 'boolean') {
      return Response.json({ message: 'enablePublicArchive must be a boolean.' }, { status: 400 })
    }

    try {
      const doc = await req.payload.updateGlobal({
        slug: 'conference-archive',
        data: {
          enablePublicArchive: body.enablePublicArchive,
        },
        depth: 0,
        overrideAccess: false,
        req,
        user: req.user,
      })

      return Response.json({
        doc: {
          enablePublicArchive: doc.enablePublicArchive !== false,
        },
      })
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message?: unknown }).message)
          : asT(req.t)('fcr:archiveUpdateFailed')

      req.payload.logger.error({
        err: error,
        msg: 'Failed to toggle Enable public archive',
      })

      return Response.json({ message }, { status: 400 })
    }
  },
}
