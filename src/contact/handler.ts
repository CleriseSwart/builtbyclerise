// The contact endpoint's logic, kept free of Cloudflare types so it can be unit-tested.
// worker/index.ts wires it to the Worker: Turnstile over fetch, e-mail through Cloudflare Email Service.

import { type ContactErrors, type ContactMessage, validateContact } from './validate'

export interface ContactEnv {
  /** Where messages go (Clérise's inbox). A Worker secret, never in code. */
  CONTACT_TO: string
  /** Sender on builtbyclerise.co.za, which is set up for Cloudflare Email Service. */
  CONTACT_FROM: string
  TURNSTILE_SECRET_KEY: string
}

export interface OutgoingMail {
  from: { email: string; name: string }
  to: string
  replyTo: { email: string; name: string }
  subject: string
  text: string
}

export interface ContactDeps {
  /** Sends one e-mail; throws when it cannot. */
  send: (mail: OutgoingMail) => Promise<unknown>
  /** For the Turnstile check. */
  fetcher?: typeof fetch
}

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: 'invalid'; errors: ContactErrors }
  | { ok: false; error: 'captcha' | 'send' | 'config' }

const TOPIC_SUBJECT: Record<ContactMessage['topic'], string> = {
  work: 'A job',
  project: 'A project',
  chat: 'Just chatting',
}

const json = (body: ContactResponse, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })

export async function handleContact(
  request: Request,
  env: ContactEnv,
  { send, fetcher = fetch }: ContactDeps,
): Promise<Response> {
  if (!env.CONTACT_TO || !env.CONTACT_FROM || !env.TURNSTILE_SECRET_KEY) {
    return json({ ok: false, error: 'config' }, 500)
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ ok: false, error: 'invalid', errors: {} }, 400)
  }

  // Honeypot: people never see the "website" field, bots fill it in. Pretend it worked.
  if (typeof body.website === 'string' && body.website !== '') return json({ ok: true })

  const result = validateContact(body)
  if (!result.ok) return json({ ok: false, error: 'invalid', errors: result.errors }, 400)

  const captcha = new FormData()
  captcha.append('secret', env.TURNSTILE_SECRET_KEY)
  captcha.append('response', typeof body.token === 'string' ? body.token : '')
  const ip = request.headers.get('CF-Connecting-IP')
  if (ip) captcha.append('remoteip', ip)
  const verify = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: captcha,
  })
  const verdict = (await verify.json().catch(() => ({}))) as { success?: boolean }
  if (!verdict.success) return json({ ok: false, error: 'captcha' }, 403)

  const { name, email, topic, message } = result.data
  try {
    await send({
      from: { email: env.CONTACT_FROM, name: 'Built by Clérise' },
      to: env.CONTACT_TO,
      replyTo: { email, name },
      subject: `builtbyclerise.co.za · ${TOPIC_SUBJECT[topic]} · ${name}`,
      text: `${message}\n\n--\n${name} <${email}>\nTopic: ${TOPIC_SUBJECT[topic]}`,
    })
  } catch (error) {
    console.error('contact: send failed', error)
    return json({ ok: false, error: 'send' }, 502)
  }

  return json({ ok: true })
}
