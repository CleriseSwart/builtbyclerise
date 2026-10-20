// The contact endpoint's logic, kept free of Cloudflare types so it can be unit-tested.
// functions/api/contact.ts wires it to Cloudflare Pages.

import { type ContactErrors, type ContactMessage, validateContact } from './validate'

export interface ContactEnv {
  /** Where messages go (Clérise's inbox). Set in Cloudflare, never in code. */
  CONTACT_TO: string
  /** Sender on a domain verified with Resend, e.g. "Built by Clérise <hello@builtbyclerise.co.za>". */
  CONTACT_FROM: string
  RESEND_API_KEY: string
  TURNSTILE_SECRET_KEY: string
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
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  if (!env.CONTACT_TO || !env.CONTACT_FROM || !env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY) {
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
  const sent = await fetcher('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `builtbyclerise.co.za · ${TOPIC_SUBJECT[topic]} · ${name}`,
      text: `${message}\n\n--\n${name} <${email}>\nTopic: ${TOPIC_SUBJECT[topic]}`,
    }),
  })
  if (!sent.ok) return json({ ok: false, error: 'send' }, 502)

  return json({ ok: true })
}
