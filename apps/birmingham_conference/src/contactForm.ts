export type ContactFormValues = {
  name: string
  email: string
  organisation: string
  message: string
}

export type ContactFormErrors = {
  name?: string
  email?: string
  message?: string
}

export type ContactFormResult =
  | { ok: true }
  | { ok: false; errors: ContactFormErrors }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactForm(values: ContactFormValues): ContactFormResult {
  const errors: ContactFormErrors = {}
  if (!values.name.trim()) errors.name = "Enter your name."
  if (!EMAIL.test(values.email.trim())) errors.email = "Enter a valid email."
  if (!values.message.trim()) errors.message = "Enter a message."
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true }
}
