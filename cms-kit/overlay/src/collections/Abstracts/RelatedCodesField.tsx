'use client'

import type { ArrayFieldClientComponent } from 'payload'
import { ArrayField, useForm, useFormFields } from '@payloadcms/ui'
import { useEffect } from 'react'

import { syncAppendicesFieldRows } from './syncAppendicesFieldRows'

/**
 * When Related codes grow/shrink, keep Appendices at 1 + relatedCodes.length.
 */
export const RelatedCodesField: ArrayFieldClientComponent = (props) => {
  const { addFieldRow, getDataByPath, removeFieldRow } = useForm()
  const relatedCodesRows = useFormFields(([fields]) => fields.relatedCodes?.rows)
  const appendicesRows = useFormFields(([fields]) => fields.appendices?.rows)

  useEffect(() => {
    syncAppendicesFieldRows({
      addFieldRow,
      appendicesRows,
      getDataByPath,
      relatedCodesRows,
      removeFieldRow,
    })
  }, [addFieldRow, appendicesRows, getDataByPath, relatedCodesRows, removeFieldRow])

  return <ArrayField {...props} />
}
