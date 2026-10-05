import { notFound } from 'next/navigation'
import { importPage } from 'nextra/pages'

import { isDocsLocale } from '@/i18n/docsLocales'

import { useMDXComponents as getMDXComponents } from '../../../../../../mdx-components'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ lang: string; mdxPath?: string[] }>
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  if (!isDocsLocale(params.lang)) notFound()
  const { metadata } = await importPage(params.mdxPath, params.lang)
  return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function DocsPage(props: PageProps) {
  const params = await props.params
  if (!isDocsLocale(params.lang)) notFound()
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(
    params.mdxPath,
    params.lang,
  )

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
