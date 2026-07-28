# Southwell Minster Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/southwell-minster` to the CoE app as a React port of the source visitor guide with TMA stop chrome and analytics tracking.

**Architecture:** Copy the 5 JPEGs into Vite assets; convert source HTML/CSS into `SouthwellMinsterPage.tsx` + scoped `southwell-minster.css`; wrap with TMA banners, optional AudioPlayer, and shared Footer; register route + tracked artwork.

**Tech Stack:** React 19, React Router 7, Vite asset imports, existing CoE AudioPlayer/Footer.

## Global Constraints

- Route: `/southwell-minster`; title: `Southwell Minster`
- Faithful port of `southwell-minster-source` content and visual design
- Full TMA chrome: banners → `/underlying-technology`, AudioPlayer if audio exists, shared TMA Footer
- Track alongside Westminster: `{ title: "Southwell Minster", path: "/southwell-minster" }`
- Scope CSS under `.southwell-minster`; no iframe / full-page `dangerouslySetInnerHTML`
- Source path: `/Users/florentgiovannone/Downloads/southwell-minster-source`

---

### Task 1: Assets + scoped CSS

**Files:**
- Create: `apps/church_of_england/src/assets/church-of-england/images/southwell/{west-front,west-window,leaves,organ,choir}.jpg`
- Create: `apps/church_of_england/src/styles/southwell-minster.css`
- Modify: `apps/church_of_england/src/assets/church-of-england/index.ts` (optional export helpers)

- [ ] **Step 1:** Copy the five JPEGs from the Downloads source into `images/southwell/`.
- [ ] **Step 2:** Port the source `<style>` block into `southwell-minster.css`, prefixing selectors with `.southwell-minster` (rewrite `body`/`main`/`footer`/`nav.toc` as descendants). Drop the hero `::before` hardcoded `url("images/west-front.jpg")`; use `--southwell-hero-image` custom property instead.
- [ ] **Step 3:** Commit: `Add Southwell Minster assets and scoped CSS.`

---

### Task 2: Page component + App wiring

**Files:**
- Create: `apps/church_of_england/src/pages/SouthwellMinsterPage.tsx`
- Modify: `apps/church_of_england/src/App.tsx`
- Modify: `apps/church_of_england/index.html` (add Google Fonts links if not already present)

- [ ] **Step 1:** Convert source `<body>` content to JSX inside `.southwell-minster`, importing images and setting `--southwell-hero-image` on the hero. Wrap with TMA banners, optional AudioPlayer via `getStopAudio("southwell-minster")`, and shared Footer. Keep source colophon footer.
- [ ] **Step 2:** Wire route, title, and `/allpages` link in `App.tsx`. Ensure Cormorant Garamond + Inter load (page-level `<link>` via `useEffect` or `index.html`).
- [ ] **Step 3:** Build: `npm run build -w @tma/app-church-of-england`. Commit: `Add Southwell Minster stop page.`

---

### Task 3: Analytics tracking

**Files:**
- Modify: `packages/analytics-church-of-england/src/index.ts`

- [ ] **Step 1:** Add `{ title: "Southwell Minster", path: "/southwell-minster" }` to `TRACKED_CHURCH_OF_ENGLAND_ARTWORKS`.
- [ ] **Step 2:** Rebuild CoE + dashboard workspaces. Commit: `Track Southwell Minster in church of england analytics.`
