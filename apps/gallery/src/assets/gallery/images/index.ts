const imageModules = import.meta.glob<string>("./*.png", {
  eager: true,
  import: "default",
})

/** Artwork slug → hero image URL. */
export const ARTWORK_IMAGES: Partial<Record<string, string>> = {}

for (const [path, url] of Object.entries(imageModules)) {
  const slug = path.match(/\/([^/]+)\.png$/)?.[1]
  if (slug) ARTWORK_IMAGES[slug] = url
}
