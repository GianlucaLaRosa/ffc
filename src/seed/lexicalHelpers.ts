export interface TextPart {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  subscript?: boolean
  superscript?: boolean
}

export type InlinePart =
  | string
  | TextPart
  | {
      type: 'link'
      url: string
      text: string
      newTab?: boolean
      bold?: boolean
      italic?: boolean
    }

type LexicalTextNode = {
  type: 'text'
  detail: 0
  format: number
  mode: 'normal'
  style: ''
  text: string
  version: 1
}

type LexicalInlineNode =
  | LexicalTextNode
  | {
      type: 'link'
      children: LexicalTextNode[]
      direction: 'ltr'
      fields: {
        linkType: 'custom'
        newTab: boolean
        url: string
      }
      format: ''
      indent: 0
      version: 3
    }

const textFormat = (part: {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  subscript?: boolean
  superscript?: boolean
}): number => {
  let format = 0
  if (part.bold) format |= 1
  if (part.italic) format |= 2
  if (part.strikethrough) format |= 4
  if (part.underline) format |= 8
  if (part.subscript) format |= 32
  if (part.superscript) format |= 64
  return format
}

const textNode = (text: string, format = 0): LexicalTextNode => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

export function createLexicalChildren(parts: InlinePart[] | string): LexicalInlineNode[] {
  if (typeof parts === 'string') return [textNode(parts)]

  return parts.map((part) => {
    if (typeof part === 'string') return textNode(part)
    if ('type' in part && part.type === 'link') {
      return {
        type: 'link',
        version: 3,
        fields: {
          linkType: 'custom',
          newTab: Boolean(part.newTab),
          url: part.url,
        },
        children: [textNode(part.text, textFormat(part))],
        direction: 'ltr',
        format: '' as const,
        indent: 0,
      }
    }
    return textNode(part.text, textFormat(part))
  })
}

export function createLexicalParagraph(parts: InlinePart[] | string) {
  return {
    type: 'paragraph',
    format: '' as const,
    indent: 0,
    version: 1,
    children: createLexicalChildren(parts),
    direction: 'ltr' as const,
  }
}

export function createLexicalHeading(tag: 'h3' | 'h4', parts: InlinePart[] | string) {
  return {
    type: 'heading',
    tag,
    format: '' as const,
    indent: 0,
    version: 1,
    children: createLexicalChildren(parts),
    direction: 'ltr' as const,
  }
}

export function createLexicalQuote(parts: InlinePart[] | string) {
  return {
    type: 'quote',
    format: '' as const,
    indent: 0,
    version: 1,
    children: createLexicalChildren(parts),
    direction: 'ltr' as const,
  }
}

export function createLexicalList(
  items: Array<InlinePart[] | string>,
  listType: 'bullet' | 'number' = 'bullet',
) {
  return {
    type: 'list',
    listType,
    tag: listType === 'number' ? 'ol' : 'ul',
    start: 1,
    format: '' as const,
    indent: 0,
    version: 1,
    children: items.map((item, index) => ({
      type: 'listitem',
      value: index + 1,
      format: '' as const,
      indent: 0,
      version: 1,
      children: createLexicalChildren(item),
      direction: 'ltr' as const,
    })),
    direction: 'ltr' as const,
  }
}

export function createLexicalRoot(children: unknown[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      children,
      direction: 'ltr' as const,
    },
  }
}

export function createLexicalDoc(paragraphs: Array<InlinePart[] | string>) {
  return createLexicalRoot(paragraphs.map((p) => createLexicalParagraph(p)))
}
