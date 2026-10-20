// The site's Worker: static assets (the prerendered pages in dist/) are served by Cloudflare before
// this code runs; only /api/* reaches it (see `run_worker_first` in wrangler.jsonc).
import { type ContactEnv, handleContact } from '../src/contact/handler'

interface Env extends ContactEnv {
  ASSETS: Fetcher
  /** Cloudflare Email Service binding. */
  EMAIL: SendEmail
}

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url)

    if (pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } })
      }
      return handleContact(request, env, { send: (mail) => env.EMAIL.send(mail) })
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
