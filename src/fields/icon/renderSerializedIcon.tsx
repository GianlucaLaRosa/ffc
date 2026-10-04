'use client'

import { createElement, type ReactNode, type SVGProps } from 'react'

type SerializedSvgNode = {
  tag: string
  attributes?: Record<string, string>
  children?: SerializedSvgNode[]
}

export type SerializedIcon = {
  viewBox: string
  attributes?: Record<string, string>
  nodes: SerializedSvgNode[]
}

function reactAttributes(attributes: Record<string, string> = {}): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [name, value] of Object.entries(attributes)) {
    result[name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())] = value
  }
  return result
}

function renderNode(node: SerializedSvgNode, key: string | number): ReactNode {
  return createElement(
    node.tag,
    { ...reactAttributes(node.attributes), key },
    node.children?.map(renderNode),
  )
}

export function RenderSerializedIcon({
  definition,
  size = 24,
  ...props
}: {
  definition: SerializedIcon
  size?: number
} & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...reactAttributes(definition.attributes)}
      {...props}
      height={size}
      viewBox={definition.viewBox}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {definition.nodes.map(renderNode)}
    </svg>
  )
}
