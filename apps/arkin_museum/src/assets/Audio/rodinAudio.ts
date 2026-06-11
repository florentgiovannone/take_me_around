const modules = import.meta.glob<string>("./rodin/*.mp3", {
  eager: true,
  import: "default",
})

/** Artwork slug → narration MP3 URL (when generated). */
export const RODIN_AUDIO: Partial<Record<string, string>> = {}

for (const [path, url] of Object.entries(modules)) {
  const slug = path.match(/\/([^/]+)\.mp3$/)?.[1]
  if (slug) RODIN_AUDIO[slug] = url
}

export function getRodinAudio(slug: string): string | undefined {
  return RODIN_AUDIO[slug]
}
