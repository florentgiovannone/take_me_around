/** Parse exhibition artworks from rodinArtworks.ts (no TS runtime needed). */

function unescapeTsString(raw) {
  return raw.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\'/g, "'")
}

function readQuoted(block, field) {
  const match = block.match(new RegExp(`${field}:\\s*(?:\\n\\s*)?"((?:\\\\.|[^"\\\\])*)"`))
  return match ? unescapeTsString(match[1]) : undefined
}

function readMeta(block) {
  const metaBlock = block.match(/meta:\s*\{([\s\S]*?)\n    \},/)?.[1]
  if (!metaBlock) return {}
  const read = (key) => {
    const m = metaBlock.match(new RegExp(`${key}:\\s*"((?:\\\\.|[^"\\\\])*)"`))
    return m ? unescapeTsString(m[1]) : undefined
  }
  return {
    height: read("height"),
    marksAndInscriptions: read("marksAndInscriptions"),
    inventoryNumber: read("inventoryNumber"),
    materials: read("materials"),
    location: read("location"),
  }
}

function readSources(block) {
  const sourcesBlock = block.match(/sources:\s*\[([\s\S]*?)\n    \],/)?.[1]
  if (!sourcesBlock) return []
  const sources = []
  for (const entry of sourcesBlock.matchAll(
    /\{\s*label:\s*"((?:\\.|[^"\\])*)",\s*href:\s*"((?:\\.|[^"\\])*)"\s*\}/g,
  )) {
    sources.push({
      label: unescapeTsString(entry[1]),
      href: unescapeTsString(entry[2]),
    })
  }
  return sources
}

function readParagraphs(block) {
  const aboutMatch = block.match(/aboutParagraphs:\s*\[([\s\S]*?)\n    \],/)
  if (!aboutMatch) return []
  const paragraphs = []
  for (const m of aboutMatch[1].matchAll(/"((?:\\.|[^"\\])*)"/g)) {
    paragraphs.push(unescapeTsString(m[1]))
  }
  return paragraphs
}

export function parseExhibitionArtworks(ts) {
  const artworks = []
  const blocks = ts.split(/\n  \},\n/).map((b, i, arr) => (i < arr.length - 1 ? b + "\n  }," : b))

  for (const block of blocks) {
    const slug = block.match(/slug:\s*"([^"]+)"/)?.[1]
    if (!slug || !block.includes("exhibitionStyle: true")) continue

    artworks.push({
      slug,
      title: readQuoted(block, "title"),
      subtitle: readQuoted(block, "subtitle"),
      artist: readQuoted(block, "artist"),
      caption: readQuoted(block, "caption"),
      summary: readQuoted(block, "summary"),
      aboutParagraphs: readParagraphs(block),
      meta: readMeta(block),
      sources: readSources(block),
    })
  }

  return artworks
}
