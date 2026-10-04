type AddFieldRow = (args: {
  path: string
  rowIndex: number
  schemaPath: string
  subFieldState?: Record<
    string,
    {
      initialValue: unknown
      valid: boolean
      value: unknown
    }
  >
}) => void

type RemoveFieldRow = (args: { path: string; rowIndex: number }) => void

const arrayLength = (value: unknown, rows: unknown): number => {
  if (Array.isArray(value)) return value.length
  if (Array.isArray(rows)) return rows.length
  return 0
}

const emptySubFieldState = {
  title: {
    initialValue: null,
    valid: true,
    value: null,
  },
  body: {
    initialValue: null,
    valid: true,
    value: null,
  },
}

/** Align appendices rows to 1 (primary) + relatedCodes.length. */
export const syncAppendicesFieldRows = ({
  addFieldRow,
  appendicesRows,
  getDataByPath,
  relatedCodesRows,
  removeFieldRow,
}: {
  addFieldRow: AddFieldRow
  appendicesRows: unknown
  getDataByPath: (path: string) => unknown
  relatedCodesRows: unknown
  removeFieldRow: RemoveFieldRow
}): void => {
  const codesLen = arrayLength(getDataByPath('relatedCodes'), relatedCodesRows)
  const appendicesLen = arrayLength(getDataByPath('appendices'), appendicesRows)
  const target = 1 + codesLen

  if (appendicesLen === target) return

  if (appendicesLen < target) {
    for (let rowIndex = appendicesLen; rowIndex < target; rowIndex++) {
      addFieldRow({
        path: 'appendices',
        rowIndex,
        schemaPath: 'appendices',
        subFieldState: emptySubFieldState,
      })
    }
    return
  }

  for (let rowIndex = appendicesLen - 1; rowIndex >= target; rowIndex--) {
    removeFieldRow({ path: 'appendices', rowIndex })
  }
}
