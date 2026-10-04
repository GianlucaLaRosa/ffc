import type { ServerProps, Where } from 'payload'
import { Card } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

const baseClass = 'collections'

export default async function SiteDashboardGroup({ payload }: ServerProps) {
  const adminRoute = payload.config.routes.admin

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
    ? `Active conference · ${conferenceTitle}`
    : 'Active conference'

  const editionTitle = conferenceTitle
    ? `Edit active edition · ${conferenceTitle}`
    : 'Edit active edition'

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
      ? `Conference archive · ${publicPast.totalDocs} public`
      : 'Conference archive'

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
        <div className={`${baseClass}__group`}>
          <h2 className={`${baseClass}__label`}>Site</h2>
          <ul className={`${baseClass}__card-list`}>
            {editionHref ? (
              <li>
                <Card
                  buttonAriaLabel={`Edit ${editionTitle}`}
                  href={editionHref}
                  id="card-edit-active-edition"
                  title={editionTitle}
                  titleAs="h3"
                />
              </li>
            ) : null}
            <li>
              <Card
                buttonAriaLabel={`Edit ${activeTitle}`}
                href={activeHref}
                id="card-active-conference"
                title={activeTitle}
                titleAs="h3"
              />
            </li>
            <li>
              <Card
                buttonAriaLabel={`Edit ${archiveTitle}`}
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
