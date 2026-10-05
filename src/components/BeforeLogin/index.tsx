'use client'

import { useTranslation } from '@payloadcms/ui'
import React from 'react'
import { asT } from '@/i18n/asT'

const BeforeLogin: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div>
      <p>
        <b>{asT(t)('fcr:beforeLoginLead')}</b>
        {asT(t)('fcr:beforeLoginBody')}
      </p>
    </div>
  )
}

export default BeforeLogin
