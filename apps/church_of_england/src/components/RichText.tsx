import type { CSSProperties } from "react"

type Tag = "p" | "span" | "h2" | "h3" | "div" | "figcaption" | "dd" | "td" | "small"

type RichTextProps = {
  html: string
  as?: Tag
  className?: string
  id?: string
  style?: CSSProperties
}

export default function RichText({
  html,
  as: Tag = "p",
  className,
  id,
  style,
}: RichTextProps) {
  return <Tag id={id} className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />
}
