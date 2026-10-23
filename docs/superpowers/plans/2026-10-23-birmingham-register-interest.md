# Birmingham Register Interest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public `/register-interest` page on the Birmingham Conference app where a visitor registers interest in one of the two conference artworks.

**Architecture:** `submitInterestRegistration` in `interestForm.ts` validates the seven fields and returns success or field errors. It does not send email, change stock, or store anything. `RegisterInterestPage` calls that function and swaps the form for a thank-you message. The route, document title, and All Pages link live in `App.tsx`.

**Tech Stack:** React 19, TypeScript, React Router 7, Vitest 3, existing `@tma/brand` `BrandHeader` and `@tma/dashboard-scope` `BIRMINGHAM_CONFERENCE_ARTWORKS`.

## Global Constraints

- URL: `/register-interest`
- Document title: `Register interest | Birmingham Conference`
- All Pages link text: `Go to Register interest page`
- Heading and submit button: `Register interest`
- Thank-you copy: `Thank you. Your interest is registered.`
- Header: `BrandHeader` with `homeHref="https://takemearound.com/"`
- Page colors: cream background `#f4f0e8`, navy type `#0e2347`, Fraunces headings, Outfit body
- Artwork slugs: `the-star-of-bethlehem`, `the-golden-boys`, labels from `BIRMINGHAM_CONFERENCE_ARTWORKS`
- Field order: Name, Surname, Email address, Company, Position, Town, Country, Artwork desired
- Error copy: `Enter your name.` `Enter your surname.` `Enter a valid email.` `Enter your company.` `Enter your position.` `Enter the town.` `Enter the country.` `Choose an artwork.`
- Email check: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` on the trimmed value. Other text fields fail when trim is empty.
- `submitInterestRegistration` performs no network request, email, or stock change
- Do not edit `contactForm.ts` or `DashboardPage.tsx`
- Do not add artworks beyond the two Birmingham Conference pieces
- Vitest environment for this app is `node` (`apps/birmingham_conference/vite.config.ts`). Do not add a component test runner.

**Spec:** `docs/superpowers/specs/2026-10-23-birmingham-register-interest-design.md`

## File map

| Path | Role |
|------|------|
| `apps/birmingham_conference/src/interestForm.ts` | Registration values, field errors, `submitInterestRegistration` |
| `apps/birmingham_conference/src/interestForm.test.ts` | Validation cases for that function |
| `apps/birmingham_conference/src/pages/RegisterInterestPage.tsx` | Form, field errors, thank-you state |
| `apps/birmingham_conference/src/App.tsx` | Route, document title, All Pages link |
| `apps/birmingham_conference/src/styles/home.css` | Layout for the register-interest page |

---

### Task 1: Interest registration validation

**Files:**
- Create: `apps/birmingham_conference/src/interestForm.ts`
- Test: `apps/birmingham_conference/src/interestForm.test.ts`

**Interfaces:**
- Consumes: `BIRMINGHAM_CONFERENCE_ARTWORKS` from `@tma/dashboard-scope`. Each item has `slug` and `title`. The two slugs are `the-star-of-bethlehem` and `the-golden-boys`.
- Produces:
  - `InterestRegistration`: `{ name: string; surname: string; email: string; company: string; position: string; country: string; artworkSlug: string }`
  - `InterestFormErrors`: optional string for each of those keys
  - `InterestFormResult`: `{ ok: true } | { ok: false; errors: InterestFormErrors }`
  - `submitInterestRegistration(values: InterestRegistration): InterestFormResult`

- [ ] **Step 1: Write the failing test**

Create `apps/birmingham_conference/src/interestForm.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { submitInterestRegistration, type InterestRegistration } from "./interestForm"

const valid: InterestRegistration = {
  name: "Ada",
  surname: "Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  position: "Curator",
  country: "United Kingdom",
  artworkSlug: "the-star-of-bethlehem",
}

describe("submitInterestRegistration", () => {
  it("rejects a blank name, surname, company, position, and country", () => {
    expect(submitInterestRegistration({ ...valid, name: "  " })).toEqual({
      ok: false,
      errors: { name: "Enter your name." },
    })
    expect(submitInterestRegistration({ ...valid, surname: "" })).toEqual({
      ok: false,
      errors: { surname: "Enter your surname." },
    })
    expect(submitInterestRegistration({ ...valid, company: "" })).toEqual({
      ok: false,
      errors: { company: "Enter your company." },
    })
    expect(submitInterestRegistration({ ...valid, position: " " })).toEqual({
      ok: false,
      errors: { position: "Enter your position." },
    })
    expect(submitInterestRegistration({ ...valid, country: "" })).toEqual({
      ok: false,
      errors: { country: "Enter the country." },
    })
  })

  it("rejects a missing artwork and an invalid email", () => {
    expect(submitInterestRegistration({ ...valid, artworkSlug: "" })).toEqual({
      ok: false,
      errors: { artworkSlug: "Choose an artwork." },
    })
    expect(submitInterestRegistration({ ...valid, email: "not-an-email" })).toEqual({
      ok: false,
      errors: { email: "Enter a valid email." },
    })
    expect(submitInterestRegistration({ ...valid, email: "  " })).toEqual({
      ok: false,
      errors: { email: "Enter a valid email." },
    })
  })

  it("returns every field error when the registration is empty", () => {
    expect(
      submitInterestRegistration({
        name: "",
        surname: "",
        email: "",
        company: "",
        position: "",
        country: "",
        artworkSlug: "",
      })
    ).toEqual({
      ok: false,
      errors: {
        name: "Enter your name.",
        surname: "Enter your surname.",
        email: "Enter a valid email.",
        company: "Enter your company.",
        position: "Enter your position.",
        country: "Enter the country.",
        artworkSlug: "Choose an artwork.",
      },
    })
  })

  it("accepts a complete registration for each conference artwork", () => {
    expect(submitInterestRegistration(valid)).toEqual({ ok: true })
    expect(
      submitInterestRegistration({ ...valid, artworkSlug: "the-golden-boys" })
    ).toEqual({ ok: true })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run from the repo root:

```bash
npm run test -w @tma/app-birmingham-conference -- src/interestForm.test.ts
```

Expected: FAIL. Vitest cannot resolve `./interestForm`.

- [ ] **Step 3: Write the minimal implementation**

Create `apps/birmingham_conference/src/interestForm.ts`:

```ts
import { BIRMINGHAM_CONFERENCE_ARTWORKS } from "@tma/dashboard-scope"

export type InterestRegistration = {
  name: string
  surname: string
  email: string
  company: string
  position: string
  country: string
  artworkSlug: string
}

export type InterestFormErrors = {
  name?: string
  surname?: string
  email?: string
  company?: string
  position?: string
  country?: string
  artworkSlug?: string
}

export type InterestFormResult =
  | { ok: true }
  | { ok: false; errors: InterestFormErrors }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ARTWORK_SLUGS = new Set<string>(
  BIRMINGHAM_CONFERENCE_ARTWORKS.map((artwork) => artwork.slug)
)

export function submitInterestRegistration(values: InterestRegistration): InterestFormResult {
  const errors: InterestFormErrors = {}
  if (!values.name.trim()) errors.name = "Enter your name."
  if (!values.surname.trim()) errors.surname = "Enter your surname."
  if (!EMAIL.test(values.email.trim())) errors.email = "Enter a valid email."
  if (!values.company.trim()) errors.company = "Enter your company."
  if (!values.position.trim()) errors.position = "Enter your position."
  if (!values.country.trim()) errors.country = "Enter the country."
  if (!ARTWORK_SLUGS.has(values.artworkSlug)) errors.artworkSlug = "Choose an artwork."
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm run test -w @tma/app-birmingham-conference -- src/interestForm.test.ts
```

Expected: PASS. 4 tests.

- [ ] **Step 5: Commit**

```bash
git add apps/birmingham_conference/src/interestForm.ts apps/birmingham_conference/src/interestForm.test.ts
git commit -m "$(cat <<'EOF'
Add Birmingham interest registration validation.

EOF
)"
```

---

### Task 2: Register interest page

**Files:**
- Create: `apps/birmingham_conference/src/pages/RegisterInterestPage.tsx`
- Modify: `apps/birmingham_conference/src/App.tsx`
- Modify: `apps/birmingham_conference/src/styles/home.css`

**Interfaces:**
- Consumes: `submitInterestRegistration`, `InterestRegistration`, and `InterestFormErrors` from `../interestForm`. Consumes `BIRMINGHAM_CONFERENCE_ARTWORKS` (`slug`, `title`) and `BrandHeader`.
- Produces: route `/register-interest` rendering `RegisterInterestPage`. Document title `Register interest | Birmingham Conference`. All Pages link `Go to Register interest page`.

- [ ] **Step 1: Add the page styles**

Append to `apps/birmingham_conference/src/styles/home.css`:

```css
.birmingham-interest {
  min-height: 100vh;
  background: #f4f0e8;
  color: #243044;
  font-family: "Outfit", "Avenir Next", sans-serif;
}

.birmingham-interest main {
  margin: 0 auto;
  max-width: 40rem;
  padding: 2rem 1rem 3rem;
}

.birmingham-interest h1 {
  margin: 0 0 1.5rem;
  color: #0e2347;
  font-family: "Fraunces", Georgia, serif;
  font-size: 2.5rem;
  font-weight: 560;
}

.birmingham-interest-form {
  display: grid;
  gap: 0.75rem;
}

.birmingham-interest-form label,
.birmingham-interest-form fieldset {
  display: grid;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  border: 0;
  color: #0e2347;
  font-size: 0.95rem;
}

.birmingham-interest-form input[type="text"],
.birmingham-interest-form input[type="email"] {
  font: inherit;
  padding: 0.6rem 0.75rem;
  border: 1px solid #d0d7e2;
  border-radius: 6px;
  color: #0e2347;
  background: #fff;
}

.birmingham-interest-options {
  display: grid;
  gap: 0.35rem;
}

.birmingham-interest-options label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.birmingham-interest-error {
  color: #9f1239;
  font-size: 0.85rem;
}

.birmingham-interest-form button {
  justify-self: start;
  border: 0;
  border-radius: 999px;
  padding: 0.75rem 1.25rem;
  background: #0e2347;
  color: #f4f0e8;
  font-family: "Outfit", "Avenir Next", sans-serif;
  font-size: 0.95rem;
  cursor: pointer;
}

.birmingham-interest-form button:hover {
  background: #16315f;
}

.birmingham-interest-thanks {
  margin: 0;
  color: #0e2347;
  font-size: 1.05rem;
}
```

`App.tsx` already imports `./styles/home.css`. Do not import it again from the page.

- [ ] **Step 2: Create the page**

Create `apps/birmingham_conference/src/pages/RegisterInterestPage.tsx`:

```tsx
import { useState, type FormEvent } from "react"
import { BrandHeader } from "@tma/brand"
import { BIRMINGHAM_CONFERENCE_ARTWORKS } from "@tma/dashboard-scope"
import {
  submitInterestRegistration,
  type InterestFormErrors,
  type InterestRegistration,
} from "../interestForm"

const EMPTY_FORM: InterestRegistration = {
  name: "",
  surname: "",
  email: "",
  company: "",
  position: "",
  country: "",
  artworkSlug: "",
}

export default function RegisterInterestPage() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<InterestFormErrors>({})
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = submitInterestRegistration(form)
    if (!result.ok) {
      setFieldErrors(result.errors)
      setSent(false)
      return
    }
    setFieldErrors({})
    setSent(true)
  }

  return (
    <div className="birmingham-interest">
      <BrandHeader homeHref="https://takemearound.com/" />
      <main>
        <h1>Register interest</h1>
        {sent ? (
          <p className="birmingham-interest-thanks">Thank you. Your interest is registered.</p>
        ) : (
          <form className="birmingham-interest-form" onSubmit={onSubmit} noValidate>
            <label>
              Name
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
              {fieldErrors.name && <span className="birmingham-interest-error">{fieldErrors.name}</span>}
            </label>
            <label>
              Surname
              <input
                type="text"
                value={form.surname}
                onChange={(event) => setForm({ ...form, surname: event.target.value })}
              />
              {fieldErrors.surname && (
                <span className="birmingham-interest-error">{fieldErrors.surname}</span>
              )}
            </label>
            <label>
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
              {fieldErrors.email && (
                <span className="birmingham-interest-error">{fieldErrors.email}</span>
              )}
            </label>
            <label>
              Company
              <input
                type="text"
                value={form.company}
                onChange={(event) => setForm({ ...form, company: event.target.value })}
              />
              {fieldErrors.company && (
                <span className="birmingham-interest-error">{fieldErrors.company}</span>
              )}
            </label>
            <label>
              Position
              <input
                type="text"
                value={form.position}
                onChange={(event) => setForm({ ...form, position: event.target.value })}
              />
              {fieldErrors.position && (
                <span className="birmingham-interest-error">{fieldErrors.position}</span>
              )}
            </label>
            <label>
              Country
              <input
                type="text"
                value={form.country}
                onChange={(event) => setForm({ ...form, country: event.target.value })}
              />
              {fieldErrors.country && (
                <span className="birmingham-interest-error">{fieldErrors.country}</span>
              )}
            </label>
            <fieldset>
              <legend>Artwork desired</legend>
              <div className="birmingham-interest-options">
                {BIRMINGHAM_CONFERENCE_ARTWORKS.map((artwork) => (
                  <label key={artwork.slug}>
                    <input
                      type="radio"
                      name="artworkSlug"
                      value={artwork.slug}
                      checked={form.artworkSlug === artwork.slug}
                      onChange={() => setForm({ ...form, artworkSlug: artwork.slug })}
                    />
                    {artwork.title}
                  </label>
                ))}
              </div>
              {fieldErrors.artworkSlug && (
                <span className="birmingham-interest-error">{fieldErrors.artworkSlug}</span>
              )}
            </fieldset>
            <button type="submit">Register interest</button>
          </form>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Register the route, title, and All Pages link**

In `apps/birmingham_conference/src/App.tsx`, import the page next to the other page imports:

```tsx
import RegisterInterestPage from "./pages/RegisterInterestPage"
```

Add the title entry inside the `titles` object in `PageTitle`:

```tsx
"/register-interest": "Register interest",
```

Inside `AllPages`, after the dashboard link paragraph, add:

```tsx
<p>
  <Link to="/register-interest">Go to Register interest page</Link>
</p>
```

Inside `Routes`, after the `/dashboard` route and before the artwork redirect routes, add:

```tsx
<Route path="/register-interest" element={<RegisterInterestPage />} />
```

Leave `IndexPage`, `DashboardPage`, `contactForm.ts`, and the artwork redirect routes unchanged.

- [ ] **Step 4: Run the validation tests and the app typecheck**

Run:

```bash
npm run test -w @tma/app-birmingham-conference -- src/interestForm.test.ts
npx tsc --noEmit -p apps/birmingham_conference/tsconfig.app.json
```

Expected: tests PASS. `tsc` exits 0.

- [ ] **Step 5: Check the page in the browser**

Start the app if it is not already running:

```bash
npm run dev -w @tma/app-birmingham-conference
```

Open the URL Vite prints, then:

1. Open `/register-interest`. Confirm the heading “Register interest”, the seven fields in order, and the two artwork choices “The Star of Bethlehem” and “The Golden Boys”.
2. Submit the empty form. Confirm all seven error messages appear and the thank-you message does not.
3. Fill Name `Ada`, Surname `Lovelace`, Email address `ada@example.com`, Company `Analytical Engines`, Position `Curator`, Country `United Kingdom`, and choose The Golden Boys. Submit. Confirm the form is replaced by “Thank you. Your interest is registered.”
4. Open `/`, `/allpages`, and `/dashboard`. Confirm each opens. On `/allpages`, confirm the link “Go to Register interest page” is present and opens the form.

- [ ] **Step 6: Commit**

```bash
git add apps/birmingham_conference/src/pages/RegisterInterestPage.tsx apps/birmingham_conference/src/App.tsx apps/birmingham_conference/src/styles/home.css
git commit -m "$(cat <<'EOF'
Add the Birmingham register-interest page.

EOF
)"
```
