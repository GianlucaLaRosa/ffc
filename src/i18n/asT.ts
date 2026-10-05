/** Loose translator for custom `fcr:*` keys (Payload’s TFunction is default-key only). */
export const asT = (t: unknown) =>
  t as (key: string, options?: Record<string, unknown>) => string
