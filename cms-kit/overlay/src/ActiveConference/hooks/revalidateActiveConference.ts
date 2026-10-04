import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateActiveConference: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating active conference`)

    revalidateTag('global_active-conference', 'max')
    // Archive listing excludes the active edition.
    revalidateTag('conference-archive', 'max')
  }

  return doc
}
