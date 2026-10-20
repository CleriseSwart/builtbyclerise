import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { createSiteI18n } from '@/i18n'
import { routes } from '@/router/routes'

import LanguageToggle from './LanguageToggle.vue'

async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  return mount(LanguageToggle, { global: { plugins: [router, createSiteI18n('af')] } })
}

describe('LanguageToggle', () => {
  it('links to the same page in each language and marks the current one', async () => {
    const wrapper = await mountAt('/af/about')
    const links = wrapper.findAll('a')

    expect(links.map((a) => a.attributes('href'))).toEqual(['/en/about', '/af/about'])
    expect(links[1]!.attributes('aria-current')).toBe('true')
    expect(links[0]!.attributes('aria-current')).toBeUndefined()
  })

  it('falls back to the home page from the 404', async () => {
    const wrapper = await mountAt('/does-not-exist')
    expect(wrapper.findAll('a').map((a) => a.attributes('href'))).toEqual(['/en', '/af'])
  })
})
