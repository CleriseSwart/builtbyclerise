import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { PAGE_PATHS } from '@/site'

import { pageRoutes, routes } from './routes'

const router = () => createRouter({ history: createMemoryHistory(), routes })

describe('routes', () => {
  it('match the prerender list in src/site.ts', () => {
    expect(pageRoutes.map((r) => r.path)).toEqual([...PAGE_PATHS])
  })

  it('resolve pages under a supported locale', () => {
    const route = router().resolve('/af/about')
    expect(route.name).toBe('about')
    expect(route.params.locale).toBe('af')
  })

  it('send unknown locales and paths to the 404 page', () => {
    expect(router().resolve('/nl/about').name).toBe('not-found')
    expect(router().resolve('/en/nope').name).toBe('not-found')
  })

  it('redirect the root to English', async () => {
    const r = router()
    await r.push('/')
    expect(r.currentRoute.value.fullPath).toBe('/en')
  })
})
