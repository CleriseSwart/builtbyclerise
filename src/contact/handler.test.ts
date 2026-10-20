import { describe, expect, it, vi } from 'vitest'

import { type ContactEnv, handleContact } from './handler'

const env: ContactEnv = {
  CONTACT_TO: 'inbox@example.com',
  CONTACT_FROM: 'Site <hello@example.com>',
  RESEND_API_KEY: 're_test',
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

/** A fetch double: Turnstile answers `captcha`, Resend answers with `sendStatus`. */
function fakeFetch({ captcha = true, sendStatus = 200 } = {}) {
  return vi.fn(async (url: string | URL | Request) =>
    String(url).includes('turnstile')
      ? Response.json({ success: captcha })
      : new Response('{}', { status: sendStatus }),
  ) as unknown as typeof fetch & ReturnType<typeof vi.fn>
}

describe('handleContact', () => {
  it('verifies the captcha, then e-mails the message with reply-to set', async () => {
    const fetcher = fakeFetch()
    const response = await handleContact(post(message), env, fetcher)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(fetcher).toHaveBeenCalledTimes(2)
    const [url, init] = fetcher.mock.calls[1] as [string, RequestInit]
    expect(url).toBe('https://api.resend.com/emails')
    const email = JSON.parse(String(init.body))
    expect(email.to).toEqual(['inbox@example.com'])
    expect(email.reply_to).toBe('jan@example.com')
    expect(email.subject).toContain('A project')
    expect(email.text).toContain('Can you build us a shop?')
  })

  it('returns field errors without calling any service', async () => {
    const fetcher = fakeFetch()
    const response = await handleContact(post({ ...message, email: 'nope' }), env, fetcher)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      ok: false,
      error: 'invalid',
      errors: { email: 'invalid' },
    })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('refuses when the captcha fails', async () => {
    const response = await handleContact(post(message), env, fakeFetch({ captcha: false }))
    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ ok: false, error: 'captcha' })
  })

  it('reports a failed send', async () => {
    const response = await handleContact(post(message), env, fakeFetch({ sendStatus: 500 }))
    expect(response.status).toBe(502)
  })

  it('quietly drops honeypot submissions', async () => {
    const fetcher = fakeFetch()
    const response = await handleContact(
      post({ ...message, website: 'spam.example' }),
      env,
      fetcher,
    )
    expect(await response.json()).toEqual({ ok: true })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('fails closed when a secret is missing', async () => {
    const response = await handleContact(post(message), { ...env, RESEND_API_KEY: '' }, fakeFetch())
    expect(response.status).toBe(500)
  })
})
