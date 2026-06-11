#!/usr/bin/env node
/**
 * Scrape Arkın Rodin Collection exhibition pages and download images.
 * Usage: node scripts/scrape-arkin.mjs [--slug the-secret] [--dry-run]
 */
import { execSync } from "node:child_process"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS = join(__dirname, "../src/assets/rodin")
const OUT_JSON = join(__dirname, "arkin_scrape.json")

const SLUG_MAP = {
  "the-secret": "the-secret",
  "right-clenched-hand%2C-large-model": "main-crispee-droite",
  "l%E2%80%99%C3%A2ge-d%E2%80%99airain%2C-petit-mod%C3%A8le%2C-2%C3%A8me-reduction-%5Bage-of-bronze%2C-small-model%2C-2nd-reduction%5D":
    "age-of-bronze-small",
  "je-suis-belle-%5Bi-am-beautiful%5D": "je-suis-belle",
  "bust-of-jean-d%27aire": "bust-of-jean-daire",
  "bust-of-jean-d&apos;aire": "bust-of-jean-daire",
  "seated-titan": "seated-titan",
  "titan-iv": "titan-iv",
  "l%E2%80%99enl%C3%A8vement-d%E2%80%99hippodamie-%5Bthe-abduction-of-hippodamia%5D":
    "abduction-of-hippodamia",
  minotaur: "minotaur",
  "camille-claudel-au-bonnet-%5Bbust-of-camille-claudel-wearing-a-bonnet%5D":
    "camille-claudel-bonnet",
  "mme-rodin-%5Bbust-of-rose-beuret%5D": "mme-rodin",
  "masque-d%E2%80%99hanako%2C-%C3%A8tude-type-e-%5Bmask-of-hanako%2C-study-type-e%5D":
    "mask-of-hanako",
  "t%C3%AAte-de-la-luxure-%5Bhead-of-lust%5D": "head-of-lust",
  "masque-de-l%E2%80%99homme-au-nez-cass%C3%A9-%5Bmask-of-a-man-with-a-broken-nose%5D":
    "mask-broken-nose",
  "torse-de-la-grande-ombre-%5Btorso-of-the-great-shadow%5D": "torso-great-shadow",
  "t%C3%AAte-de-jean-de-fiennes-%5Bhead-of-jean-de-fiennes%5D": "head-jean-de-fiennes",
  "t%C3%AAte-de-pierre-de-wiessant%2C-type-b-%5Bhead-of-pierre-de-wiessant%2C-type-b%5D":
    "head-pierre-de-wiessant",
  "t%C3%AAte-d%E2%80%99eustache-de-saint-pierre%2C-%C3%A8tude-type-a%2C-grand-mod%C3%A8le--%5Bhead-of-d%E2%80%99eustache-de-saint-pierre%2C-study-type-a%2C-large-model%5D":
    "head-eustache-de-saint-pierre",
  "eve%2C-petit-mod%C3%A8le-(mod%C3%A8le-%C3%A0-la-base-carr%C3%A9e-et-aux-pieds-plats)-%5Beve%2C-small-model-(model-with-a-square-base-and-flat-feet)%5D":
    "eve-small-model",
  "la-m%C3%A9ditation-%5Bmeditation%5D-": "meditation",
  "iris%2C-%C3%A9tude-avec-t%C3%A9te-%5Biris%2C-study-with-head%5D": "iris-study-with-head",
  "l%E2%80%99homme-qui-tombe-%5Bthe-falling-man%5D": "falling-man",
  "grande-torse-de-l%E2%80%99homme-%5Bmonumental-torso%5D": "monumental-torso",
  "le-baiser%2C-3%C3%A8me-r%C3%A9duction-%5Bthe-kiss%2C-2nd-reduction%5D": "the-kiss-3rd-reduction",
  "l%E2%80%99%C3%A9ternel-printemps%2C-premier-%C3%A9tat-%5Beternal-spring%2C-first-state%5D":
    "eternal-spring-first-state",
  "la-jeunesse-triomphante-%5Btriumphant-youth%5D": "triumphant-youth",
  "mort-d%27adonis-%5Bdeath-of-adonis%5D": "death-of-adonis",
  "mort-d&apos;adonis-%5Bdeath-of-adonis%5D": "death-of-adonis",
  "%C3%A9ternelle-idole%2C-petit-modele-%5Beternal-idol%2C-small-model%5D-":
    "eternal-idol-small-model",
  "l%E2%80%99%C3%A2ge-d%E2%80%99airain-%5Bage-of-bronze%5D": "age-of-bronze",
  "jardini%C3%A8re-aux-titans": "jardiniere-of-the-titans",
  "dana%C3%AFde-%5Bdanaide%5D": "danaide",
}

function curl(url) {
  return execSync(`curl -sL "${url.replace(/"/g, '\\"')}"`, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 })
}

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
}

function stripTags(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, "").trim())
}

function parsePage(html, url) {
  const captionMatch = html.match(/Conceived[^<.]+\./i)
  const caption = captionMatch ? stripTags(captionMatch[0]) : null

  const blocks = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gis)].map((m) => stripTags(m[1]))
  const meta = {}
  for (let i = 0; i < blocks.length; i++) {
    const bl = blocks[i].toLowerCase()
    const next = blocks[i + 1]
    if (!next) continue
    if (bl === "height") meta.height = next.replace(/(\d)(cm)/i, "$1 cm")
    else if (bl.includes("marks") && bl.includes("inscription")) meta.marksAndInscriptions = next
    else if (bl === "inventory number") meta.inventoryNumber = next
    else if (bl === "materials") meta.materials = next
    else if (bl === "location") meta.location = next
  }

  const imgs = [...html.matchAll(/https:\/\/static\.wixstatic\.com\/media\/[^"\s]+/g)].map((m) => m[0])
  let best = null
  let bestArea = 0
  for (const img of imgs) {
    if (img.includes("blur_") || img.includes(",w_147,") || img.includes("enc_avif")) continue
    const wm = img.match(/w_(\d+),h_(\d+)/)
    if (wm) {
      const area = Number(wm[1]) * Number(wm[2])
      if (area > bestArea) {
        bestArea = area
        best = img
      }
    }
  }

  return { url, caption, meta, image: best }
}

const args = process.argv.slice(2)
const onlySlug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null
const dryRun = args.includes("--dry-run")

const sitemapXml = curl(
  "https://www.thearkinrodincollection.com/dynamic-our-exhibitions_p_4b2712c7_28e1_403b_a17d_d84c3164b147_0_5000-sitemap.xml",
)
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  .filter((u) => !u.includes("grace-liu"))
urls.push("https://www.thearkinrodincollection.com/our-exhibitions/dana%C3%AFde-%5Bdanaide%5D")

const results = {}
for (let url of urls) {
  url = url.replace(/&apos;/g, "%27")
  const path = url.replace("https://www.thearkinrodincollection.com/our-exhibitions/", "")
  const slug = SLUG_MAP[path]
  if (!slug) {
    console.warn("No slug for", path.slice(0, 50))
    continue
  }
  if (onlySlug && slug !== onlySlug) continue

  const html = curl(url)
  const data = parsePage(html, url)
  data.slug = slug

  if (data.image && !dryRun) {
    const filename = `${slug}-1.jpg`
    execSync(`curl -sL "${data.image}" -o "${join(ASSETS, filename)}"`)
    data.localImage = filename
  }

  results[slug] = data
  console.log(`${slug}: caption=${data.caption ? "yes" : "no"} image=${data.image ? "yes" : "no"} meta=${Object.keys(data.meta).length}`)
}

writeFileSync(OUT_JSON, JSON.stringify(results, null, 2))
console.log(`Wrote ${Object.keys(results).length} entries to ${OUT_JSON}`)
