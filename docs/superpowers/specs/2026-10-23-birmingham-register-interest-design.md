# Birmingham register interest — design

**Date:** 2026-10-23  
**Status:** Approved for planning  
**App:** `apps/birmingham_conference`  
**Approach:** Standalone page at `/register-interest` with one submit function. Email confirmation and artwork stock stay out of this version.

## Goal

Give Birmingham Conference a public page where someone can register interest in one artwork. The page is separate from the dashboard “Talk to us” form.

## Decisions

| Topic | Choice |
|-------|--------|
| URL | `/register-interest` |
| Title | Register interest \| Birmingham Conference |
| Discovery | Link on `/allpages`: “Go to Register interest page” |
| Home and dashboard contact form | Unchanged |
| Artwork | One choice: The Star of Bethlehem or The Golden Boys, from `BIRMINGHAM_CONFERENCE_ARTWORKS` |
| Submit | `submitInterestRegistration` validates, then returns success |
| Email confirmation | Later. Not called from this version |
| Artwork stock | Later. Not called from this version |
| Storage | None in this version |

## Fields

Shown in this order. Every field is required.

| Order | Label | Control | Error |
|-------|--------|---------|--------|
| 1 | Name | Text | Enter your name. |
| 2 | Surname | Text | Enter your surname. |
| 3 | Email address | Email | Enter a valid email. |
| 4 | Position | Text | Enter your position. |
| 5 | Company | Text | Enter your company. |
| 6 | Town of company | Text | Enter the town. |
| 7 | Country | Text | Enter the country. |
| 8 | Artwork desired | One of the two artworks | Choose an artwork. |

Blank checks use the trimmed value. Email must match a simple `local@domain.tld` pattern, the same kind of check as `validateContactForm`. Several fields can fail together. Each error is shown under its field.

Artwork values are the existing slugs `the-star-of-bethlehem` and `the-golden-boys`. Labels are the artwork titles.

## Page

Uses the Birmingham cream background (`#f4f0e8`), navy type, Fraunces headings, Outfit body, and `BrandHeader` with `homeHref="https://takemearound.com/"`, matching the home page. Heading: “Register interest”. Submit button label: “Register interest”.

After a successful submit, the form is replaced by: “Thank you. Your interest is registered.”

## Submit boundary

`submitInterestRegistration` is the only function a later email service or stock reservation may extend.

Input:

- `name`, `surname`, `email`, `position`, `company`, `town`, `country` as strings
- `artworkSlug`: `the-star-of-bethlehem` or `the-golden-boys`, or empty when nothing is chosen

Result:

- `{ ok: false, errors }` when any field fails. The page stays on the form.
- `{ ok: true }` when every field passes. No network request, email, or stock change.

## Files

```
apps/birmingham_conference/
  src/interestForm.ts                  # values, validation, submitInterestRegistration
  src/interestForm.test.ts             # validation cases
  src/pages/RegisterInterestPage.tsx   # form and thank-you state
  src/App.tsx                          # route, document title, all-pages link
  src/styles/home.css                  # form layout on the register-interest page
```

`contactForm.ts` and `DashboardPage.tsx` stay as they are.

## Tests

`interestForm.test.ts` rejects a blank name, surname, position, company, town, and country; a missing artwork; and an invalid email. It accepts a complete registration for each artwork slug.

Browser check after implementation: open `/register-interest`, submit empty, correct the errors, submit a valid registration, and confirm the thank-you message. Confirm `/`, `/allpages`, and `/dashboard` still open.

## Out of scope

- Sending a confirmation email
- Reserving or displaying stock
- Saving registrations
- Changing the dashboard contact form
- Adding artworks beyond the two Birmingham Conference pieces
