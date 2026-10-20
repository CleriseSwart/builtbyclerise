import { describe, expect, it, vi } from 'vitest'

import { type ContactEnv, handleContact, type OutgoingMail } from './handler'

const env: ContactEnv = {
  CONTACT_TO: 'inbox@example.com',
  CONTACT_FROM: 'hello@example.com',
  TURNSTILE_SECRET_KEY: 'secret',
}

const message = {
  name: 'Jan Smit',
  email: 'jan@example.com',
  topic: 'project',
  message: 'Can you build us a shop?',
  token: 'turnstile-token',
}

const post = (body: unknown) =>
  new Request('https://builtbyclerise.co.za/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
  })

/** Test doubles: Turnstile answers `captcha`; the mailer records mail or throws. */
function fakes({ captcha = true, sendFails = false } = {}) {
  const fetcher = vi.fn(async () =>
    Response.json({ success: captcha }),
  ) as unknown as typeof fetch & ReturnType<typeof vi.fn>
  const send = vi.fn(async (mail: OutgoingMail) => {
    if (sendFails) throw Object.assign(new Error('nope'), { code: 'E_DELIVERY_FAILED' })
    return mail
  })
  return { fetcher, send }
}

describe('handleContact', () => {
  it('verifies the captcha, then e-mails the message with reply-to set', async () => {
    const deps = fakes()
    const response = await handleContact(post(message), env, deps)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(deps.fetcher).toHaveBeenCalledOnce()
    expect(deps.send).toHaveBeenCalledOnce()
    const mail = deps.send.mock.calls[0]![0]
    expect(mail.to).toBe('inbox@example.com')
    expect(mail.from.email).toBe('hello@example.com')
    expect(mail.replyTo).toEqual({ email: 'jan@example.com', name: 'Jan Smit' })
    expect(mail.subject).toContain('A project')
    expect(mail.text).toContain('Can you build us a shop?')
  })

  it('returns field errors without calling any service', async () => {
    const deps = fakes()
    const response = await handleContact(post({ ...message, email: 'nope' }), env, deps)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      ok: false,
      error: 'invalid',
      errors: { email: 'invalid' },
    })
    expect(deps.fetcher).not.toHaveBeenCalled()
    expect(deps.send).not.toHaveBeenCalled()
  })

  it('refuses when the captcha fails', async () => {
    const deps = fakes({ captcha: false })
    const response = await handleContact(post(message), env, deps)
    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ ok: false, error: 'captcha' })
    expect(deps.send).not.toHaveBeenCalled()
  })

  it('reports a failed send', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const response = await handleContact(post(message), env, fakes({ sendFails: true }))
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ ok: false, error: 'send' })
  })

  it('quietly drops honeypot submissions', async () => {
    const deps = fakes()
    const response = await handleContact(post({ ...message, website: 'spam.example' }), env, deps)
    expect(await response.json()).toEqual({ ok: true })
    expect(deps.fetcher).not.toHaveBeenCalled()
    expect(deps.send).not.toHaveBeenCalled()
  })

  it('fails closed when a secret is missing', async () => {
    const response = await handleContact(post(message), { ...env, CONTACT_TO: '' }, fakes())
    expect(response.status).toBe(500)
  })
})
