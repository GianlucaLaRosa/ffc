import type { ServerProps, Where } from 'payload'
import { Banner, Card } from '@payloadcms/ui'
import { Pencil } from 'lucide-react'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import './index.scss'
import '../EditActiveEditionNavLink/index.scss'
import { asT } from '@/i18n/asT'

const baseClass = 'collections'

export default async function SiteDashboardGroup({ i18n, payload }: ServerProps) {
  const adminRoute = payload.config.routes.admin
  const t = i18n.t

  const active = await payload.findGlobal({
    slug: 'active-conference',
    depth: 1,
    select: {
      conference: true,
    },
  })

  const conference = active.conference
  const conferenceTitle =
    typeof conference === 'object' && conference !== null && 'title' in conference
      ? (conference.title ?? null)
      : null

  const activeId =
    typeof conference === 'object' && conference !== null
      ? conference.id
      : conference

  const activeTitle = conferenceTitle
    ? `${asT(t)('fcr:activeConference')} · ${conferenceTitle}`
    : asT(t)('fcr:activeConference')

  const where: Where = {
    and: [
      { _status: { equals: 'published' } },
      ...(activeId != null ? [{ id: { not_equals: activeId } }] : []),
      { publicArchive: { equals: true } },
    ],
  }

  const publicPast = await payload.find({
    collection: 'conferences',
    depth: 0,
    draft: false,
    limit: 1,
    pagination: true,
    where,
    select: {
      title: true,
    },
  })

  const archiveTitle =
    publicPast.totalDocs > 0
      ? `${asT(t)('fcr:conferenceArchive')} · ${asT(t)('fcr:publicCount', { count: publicPast.totalDocs })}`
      : asT(t)('fcr:conferenceArchive')

  const activeHref = formatAdminURL({
    adminRoute,
    path: '/globals/active-conference',
  })

  const editionHref =
    activeId != null
      ? formatAdminURL({
          adminRoute,
          path: `/collections/conferences/${activeId}`,
        })
      : null

  const archiveHref = formatAdminURL({
    adminRoute,
    path: '/globals/conference-archive',
  })

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__wrap`}>
        <div className="editor-guide-dashboard" id="dashboard-editor-guide">
          <Banner
            alignIcon="right"
            className="editor-guide-dashboard__banner"
            icon={
              <span aria-hidden className="editor-guide-dashboard__chevron">
                →
              </span>
            }
            to="/docs"
            type="success"
          >
            <strong className="editor-guide-dashboard__title">{asT(t)('fcr:editorGuideTitle')}</strong>
            <span className="editor-guide-dashboard__text">{asT(t)('fcr:editorGuideText')}</span>
          </Banner>
        </div>
        {editionHref ? (
          <div className="edit-active-edition edit-active-edition--dashboard">
            <a
              className="edit-active-edition__link"
              href={editionHref}
              id="card-edit-active-edition"
            >
              <span aria-hidden className="edit-active-edition__icon">
                <Pencil size={16} strokeWidth={2.25} />
              </span>
              <span className="edit-active-edition__copy">
                <span className="edit-active-edition__label">{asT(t)('fcr:editActiveEdition')}</span>
                {conferenceTitle ? (
                  <span className="edit-active-edition__title">{conferenceTitle}</span>
                ) : null}
              </span>
            </a>
          </div>
        ) : null}
        <div className={`${baseClass}__group`}>
          <h2 className={`${baseClass}__label`}>{asT(t)('fcr:site')}</h2>
          <ul className={`${baseClass}__card-list`}>
            <li>
              <Card
                buttonAriaLabel={activeTitle}
                href={activeHref}
                id="card-active-conference"
                title={activeTitle}
                titleAs="h3"
              />
            </li>
            <li>
              <Card
                buttonAriaLabel={archiveTitle}
                href={archiveHref}
                id="card-conference-archive"
                title={archiveTitle}
                titleAs="h3"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
