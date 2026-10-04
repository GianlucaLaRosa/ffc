import type { GlobalAfterChangeHook } from 'payload'

/** No-op until the public site uses cache tags (homepage is force-dynamic). */
export const revalidateActiveConference: GlobalAfterChangeHook = ({ doc }) => doc
