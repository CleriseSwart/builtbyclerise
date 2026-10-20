# builtbyclerise.co.za - Clérise Swart's portfolio

Personal content rules and working agreements live in `CLAUDE.local.md` (git-ignored). Read it first.

## What this site is for

Her portfolio on **builtbyclerise.co.za** (+ `www`): a software engineer who is also a creative and a
business owner, presented with grace and humour. It is also a job-hunting portfolio, so the site and
its source code have to prove her **Vue** skills.

- **The main focus is software engineering.** The creative side and the playful design support that
  story; they never crowd it out. Lead with engineering in copy, page order and case studies.
- English first, Afrikaans optional: every page exists in `/en` (default) and `/af`.
- Indexable and SEO-strong: prerendered HTML per page and language, meta/OG tags, hreflang, sitemap,
  JSON-LD.
- Content is factual: every claim must be traceable to her brief or the project's own code/README.

## Design direction: "Stitched Systems" (approved)

- Ink-navy linen base (`--color-ink` #0d1322) and one raspberry "thread" accent (`--color-thread`
  #ff5c8a); tokens in `src/styles/main.css`. Fonts: Bricolage Grotesque (display), Figtree (body),
  Martian Mono (labels), self-hosted.
- Running stitch for dividers and the timeline, satin stitch for emphasis, projects as a deck of cards.
- Home hero: a 3D embroidery machine stitching the satin "C" monogram (TresJS/Three.js, home page only,
  lazy-loaded). Behaviour = the approved mock (artifact version 3): needle head fixed over the centre,
  the hoop moves under it while stitching (one needle stroke per stitch), then the head lifts away and
  the hoop eases back to centre. Click = new thread colour and re-stitch; the pointer tilts the hoop.
  Large hoop, small head, unhurried stitching. Never a hand needle.
- Motion stays fast and accessible: respect `prefers-reduced-motion`, aim for Lighthouse ~100,
  keyboard and screen-reader friendly.

## Tech

- Vue 3.5 + TypeScript (strict) + Vite 8 + Tailwind CSS v4, prerendered with vite-ssg
  (`dirStyle: flat`), vue-i18n, @unhead/vue. `<script setup lang="ts">`, ESLint flat config + Prettier
  (no semicolons, single quotes, 100 columns). Tests: Vitest + @vue/test-utils, `*.test.ts` next to the
  code. `npm run check` is what CI runs.
- `src/site.ts` is the single list of pages and locales (router, prerender, sitemap, hreflang). Add a
  page there and in `src/router/routes.ts`; a test checks they match.
- UI strings in `src/i18n/*.json` (en.json is the schema; `scripts/check-i18n.mjs` and vue-tsc fail on
  gaps). Long-form content in `src/content/*.ts` as `Localized<T>`.
- Contact form: Pages Function `functions/api/contact.ts` -> `src/contact/handler.ts` (Turnstile, then
  Resend). Secrets only in Cloudflare env vars (see README).
- Hosting: Cloudflare Pages, push to `main` = live. Public repo `CleriseSwart/builtbyclerise`.
- Local Node is 24.13; some deps want >= 24.15 (warnings only). CI uses the latest Node 24.
