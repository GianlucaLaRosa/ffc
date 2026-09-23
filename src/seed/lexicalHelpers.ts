export interface TextPart {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  subscript?: boolean
  superscript?: boolean
}

export function createLexicalParagraph(parts: TextPart[] | string) {
  const children =
    typeof parts === 'string'
      ? [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text: parts,
            version: 1,
          },
        ]
      : parts.map((part) => {
          let format = 0
          if (part.bold) format |= 1
          if (part.italic) format |= 2
          if (part.strikethrough) format |= 4
          if (part.underline) format |= 8
          if (part.subscript) format |= 32
          if (part.superscript) format |= 64

          return {
            type: 'text',
            detail: 0,
            format,
            mode: 'normal' as const,
            style: '',
            text: part.text,
            version: 1,
          }
        })

  return {
    type: 'paragraph',
    format: '' as const,
    indent: 0,
    version: 1,
    children,
    direction: 'ltr' as const,
  }
}

export function createLexicalDoc(paragraphs: Array<TextPart[] | string>) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      children: paragraphs.map((p) => createLexicalParagraph(p)),
      direction: 'ltr' as const,
    },
  }
}
