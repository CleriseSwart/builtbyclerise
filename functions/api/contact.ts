// Cloudflare Pages Function: POST /api/contact. The logic lives in src/contact/handler.ts.
import { type ContactEnv, handleContact } from '../../src/contact/handler'

export const onRequestPost: PagesFunction<ContactEnv> = ({ request, env }) =>
  handleContact(request, env)
