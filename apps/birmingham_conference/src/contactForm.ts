export const CONTACT_THANKS =
  "Thank you for your message. We have sent a confirmation email to your inbox and will be in touch soon."

export const CONTACT_UNAVAILABLE =
  "We could not send your message right now. Please try again later."

export type ContactFormValues = {
  name: string
  email: string
  organisation: string
  message: string
}

export type ContactFormErrors = {
  name?: string
  email?: string
  organisation?: string
  message?: string
}

export type ContactFormResult =
  | { ok: true }
  | { ok: false; errors: ContactFormErrors }

export type ContactSubmitOutcome =
  | { type: "sent"; message: string }
  | { type: "fields"; errors: ContactFormErrors }
  | { type: "message"; message: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LIMITS = {
  name: 100,
  email: 254,
  organisation: 200,
  message: 2000,
} as const

export function validateContactForm(values: ContactFormValues): ContactFormResult {
  const errors: ContactFormErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const organisation = values.organisation.trim()
  const message = values.message.trim()

  if (name.length > LIMITS.name) {
    errors.name = `Use ${LIMITS.name} characters or fewer.`
  } else if (!name) {
    errors.name = "Enter your name."
  }

  if (email.length > LIMITS.email) {
    errors.email = `Use ${LIMITS.email} characters or fewer.`
  } else if (!EMAIL.test(email)) {
    errors.email = "Enter a valid email."
  }

  if (organisation.length > LIMITS.organisation) {
    errors.organisation = `Use ${LIMITS.organisation} characters or fewer.`
  }

  if (message.length > LIMITS.message) {
    errors.message = `Use ${LIMITS.message} characters or fewer.`
  } else if (!message) {
    errors.message = "Enter a message."
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true }
}

export function contactPayload(values: ContactFormValues): ContactFormValues {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    organisation: values.organisation.trim(),
    message: values.message.trim(),
  }
}

export function contactOutcomeFromResponse(
  status: number,
  body: { ok: boolean; error?: string; message?: string; errors?: ContactFormErrors }
): ContactSubmitOutcome {
  if (status === 201 && body.ok) {
    return { type: "sent", message: CONTACT_THANKS }
  }
  if (body.errors) {
    return { type: "fields", errors: body.errors }
  }
  return { type: "message", message: body.message || CONTACT_UNAVAILABLE }
}
