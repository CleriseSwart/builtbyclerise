// Site-wide constants shared by the app, the SSG build (vite.config.ts) and the sitemap.
// Kept free of Vue imports so Node can load it at build time.

export const SITE_URL = 'https://builtbyclerise.co.za'
export const SITE_NAME = 'Built by Clérise'

export const SUPPORTED_LOCALES = ['en', 'af'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

/** Child paths under `/:locale`. '' is the home page. */
export const PAGE_PATHS = [
  '',
  'work',
  'work/few-cutting-tools',
  'work/embroidery-blanks',
  'about',
  'contact',
] as const
export type PagePath = (typeof PAGE_PATHS)[number]

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

/** `/en`, `/en/about`, ... */
export function localePath(locale: Locale, page: PagePath = ''): string {
  return page ? `/${locale}/${page}` : `/${locale}`
}

/** Every prerendered page, in every locale. */
export function prerenderPaths(): string[] {
  return SUPPORTED_LOCALES.flatMap((locale) => PAGE_PATHS.map((page) => localePath(locale, page)))
}

export function buildSitemap(lastmod: string): string {
  const urls = PAGE_PATHS.map((page) => {
    const alternates = SUPPORTED_LOCALES.map(
      (locale) =>
        `    <xhtml:link rel="alternate" hreflang="${locale}" href="${SITE_URL}${localePath(locale, page)}"/>`,
    ).join('\n')
    const fallback = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localePath(DEFAULT_LOCALE, page)}"/>`
    return SUPPORTED_LOCALES.map(
      (locale) =>
        `  <url>\n    <loc>${SITE_URL}${localePath(locale, page)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n${fallback}\n  </url>`,
    ).join('\n')
  }).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}
