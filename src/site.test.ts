import { describe, expect, it } from 'vitest'

import { buildSitemap, isLocale, localePath, prerenderPaths } from './site'

describe('localePath', () => {
  it('builds locale-prefixed paths without a trailing slash', () => {
    expect(localePath('en')).toBe('/en')
    expect(localePath('af', 'about')).toBe('/af/about')
  })
})

describe('isLocale', () => {
  it('accepts only supported locales', () => {
    expect(isLocale('af')).toBe(true)
    expect(isLocale('nl')).toBe(false)
    expect(isLocale(['en'])).toBe(false)
  })
})

describe('prerenderPaths', () => {
  it('lists every page in every locale', () => {
    expect(prerenderPaths()).toEqual([
      '/en',
      '/en/work',
      '/en/work/few-cutting-tools',
      '/en/work/embroidery-blanks',
      '/en/about',
      '/en/contact',
      '/af',
      '/af/work',
      '/af/work/few-cutting-tools',
      '/af/work/embroidery-blanks',
      '/af/about',
      '/af/contact',
    ])
  })
})

describe('buildSitemap', () => {
  const xml = buildSitemap('2026-10-20')

  it('has one <url> per page and locale', () => {
    expect(xml.match(/<url>/g)).toHaveLength(prerenderPaths().length)
  })

  it('links each page to its translations and an English x-default', () => {
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="af" href="https://builtbyclerise.co.za/af/about"/>',
    )
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="x-default" href="https://builtbyclerise.co.za/en/about"/>',
    )
  })
})
