// Contact-form rules, shared by the form (instant feedback) and the Pages Function (the real check).
// No Vue or DOM imports: this file also runs on Cloudflare's edge.

export const CONTACT_TOPICS = ['work', 'project', 'chat'] as const
export type ContactTopic = (typeof CONTACT_TOPICS)[number]

export interface ContactMessage {
  name: string
  email: string
  topic: ContactTopic
  message: string
}

export type ContactField = keyof ContactMessage
export type FieldError = 'required' | 'invalid' | 'tooLong'
export type ContactErrors = Partial<Record<ContactField, FieldError>>

export const LIMITS: Record<ContactField, number> = {
  name: 100,
  email: 254,
  topic: 20,
  message: 5000,
}

// Deliberately loose: one @, something on both sides, a dot in the domain. The reply proves the rest.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ValidationResult =
  { ok: true; data: ContactMessage } | { ok: false; errors: ContactErrors }

export function validateContact(input: Record<string, unknown>): ValidationResult {
  const text = (key: ContactField) =>
    typeof input[key] === 'string' ? (input[key] as string).trim() : ''
  const values = {
    name: text('name'),
    email: text('email'),
    topic: text('topic'),
    message: text('message'),
  }
  const errors: ContactErrors = {}

  for (const field of Object.keys(values) as ContactField[]) {
    if (!values[field]) errors[field] = 'required'
    else if (values[field].length > LIMITS[field]) errors[field] = 'tooLong'
  }
  if (!errors.email && !EMAIL.test(values.email)) errors.email = 'invalid'
  if (!errors.topic && !(CONTACT_TOPICS as readonly string[]).includes(values.topic)) {
    errors.topic = 'invalid'
  }

  if (Object.keys(errors).length) return { ok: false, errors }
  return { ok: true, data: { ...values, topic: values.topic as ContactTopic } }
}
