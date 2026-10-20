# builtbyclerise.co.za

The portfolio of **Clérise Swart**, software engineer. The site is part of the portfolio: this
repository is meant to be read.

**Stack:** Vue 3 (`<script setup lang="ts">`), TypeScript (strict), Vite, vite-ssg, Tailwind CSS v4,
vue-i18n, Unhead, TresJS, Vitest. Hosted on Cloudflare Pages as a static site.

## What it does

- **Prerendered, bilingual pages.** Every page is rendered to static HTML at build time in English
  (`/en`, the default) and Afrikaans (`/af`), then hydrated into a Vue app in the browser.
- **SEO from the same source of truth.** `src/site.ts` lists the pages and locales once; the router,
  the prerender list, the sitemap and the hreflang/canonical tags all read from it, and a test keeps
  the router in step.
- **Translations that cannot drift.** `en.json` is the schema: `vue-tsc` fails if `af.json` is
  missing a key, and `scripts/check-i18n.mjs` also catches extra keys, empty strings, mismatched
  placeholders and `t('…')` calls to keys that don't exist.
- **Design direction "Stitched Systems".** Ink-navy linen, one raspberry thread. The monogram is a
  satin-stitch "C" generated from code (`src/utils/satin.ts`), the same path the home-page
  embroidery machine stitches.
- **A 3D embroidery machine in the hero.** TresJS renders the hoop; the machine itself is plain,
  tested state (`src/hero/machine.ts`). All stitches of a kind are merged into one mesh and revealed
  with a draw range, so 210 stitches cost two draw calls. The prerendered HTML carries an SVG stand-in;
  the 3D chunk loads after the page has loaded, pauses off screen and respects reduced motion.
- **Content as typed data.** Case studies, the timeline and skills live in `src/content/` as
  `Localized<T>` objects, so a missing Afrikaans version is a compile error.

## Structure

```
src/
  site.ts              pages, locales, URLs, sitemap (no Vue imports: also used by vite.config.ts)
  main.ts              vite-ssg entry; keeps vue-i18n in step with the /:locale route param
  router/routes.ts     /:locale(en|af)/… inside SiteLayout, plus the 404
  i18n/                en.json (schema) and af.json
  layouts/             SiteLayout: header, language toggle, footer
  pages/               one component per route
  components/          ProjectCard (the case-study "deck"), LanguageToggle, CardArt, …
  composables/         usePageMeta (title, description, OG, canonical, hreflang), useLocalePath,
                       usePersonSchema (JSON-LD)
  content/             case studies, timeline, skills (typed, both languages)
  hero/                the embroidery-machine hero (state, geometry, TresJS scene)
  utils/satin.ts       satin-stitch geometry
public/                favicon, robots.txt, Cloudflare _redirects and _headers
```

Tests sit next to the code they cover (`*.test.ts`).

## Scripts

| Command           | What it does                                             |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Dev server on http://localhost:5173                      |
| `npm run build`   | Translation check, typecheck, prerender to `dist/`       |
| `npm run preview` | Serve `dist/`                                            |
| `npm test`        | Vitest unit and component tests                          |
| `npm run check`   | Everything CI runs: i18n, typecheck, lint, format, tests |
| `npm run lint`    | ESLint with fixes (`lint:check` to only report)          |
| `npm run format`  | Prettier (`format:check` to only report)                 |

Requires Node 24.

## Deployment

Cloudflare Pages builds `main` on every push: build command `npm run build`, output directory
`dist`. The site is fully static; `public/_redirects` and `public/_headers` handle redirects and
security headers. GitHub Actions runs the same checks on every push and pull request.
