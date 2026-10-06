export const APPENDIX_ABSTRACT_FOCUS_EVENT = 'ffc-focus-appendix-abstract'

export type AppendixAbstractFocusDetail = {
  abstractId: string
  /** Expand the abstract row to show CMS appendix content. Defaults to true. */
  expand?: boolean
  openModal?: boolean
}

export function scrollToAppendixAbstract(
  abstractId: string | number,
  options?: { expand?: boolean; openModal?: boolean },
): void {
  window.dispatchEvent(
    new CustomEvent<AppendixAbstractFocusDetail>(APPENDIX_ABSTRACT_FOCUS_EVENT, {
      detail: {
        abstractId: String(abstractId),
        expand: options?.expand ?? true,
        openModal: options?.openModal,
      },
    }),
  )
  document.getElementById('appendix')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
