# I Am A Safe Pet

Lost-pet public pages and owner dashboard for Take Me Around.

Provisional host: `safe-pet.takemearound.gallery`

## Purpose

Finders who scan a QR/NFC collar tag land on a public pet page with safety-critical personality notes and owner contact details. Owners use a simple demo password gate to see scan and “found” events.

Home brand visuals (Scottie + tabby, speech bubbles, NFC pictogram) are adapted from the Desktop `safe_pet_page` example — rebuilt as a responsive web composition, not an A4 print sheet. Colour tokens follow the Take Me Around brand blues (`#0a479d` family, Montserrat display) rather than the example’s navy/gold print palette.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Brand home |
| `/pet/:publicId` | Public finder page (demo: `/pet/demo-mochi`) |
| `/owner` | Owner dashboard (demo password) |
| `/privacy-policy` | Privacy note |
| `/allpages` | Dev page index |

## Demo data

- Pet name: **Mochi**
- `publicId`: `demo-mochi`
- `photoUrl`: `/images/scottie.png` (Scottie illustration is placeholder brand art, not a photo of Mochi)
- Owner account id: `demo-owner`
- Demo password: `safe-pet-demo` (override with `VITE_OWNER_DEMO_PASSWORD`)
- Empty event storage is seeded with **one demo scan** (owner UI shows time, scan/found type, device, and found-location details)

## Local development

From the monorepo root:

```bash
npm install
npm run dev:i-am-a-safe-pet
```

Or:

```bash
npm run dev -w @tma/app-i-am-a-safe-pet
```

## Data notes

v1 uses seeded pets plus `localStorage` for events (`tma-safe-pet-events-v1`) behind a `SafePetRepository` interface. Backend / Flask persistence is deferred. Scan events are deduped once per browser session per pet via `sessionStorage`.

## Out of scope (v1)

- Real owner accounts
- A4 print / PDF tooling from the example
