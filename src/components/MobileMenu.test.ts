import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { createSiteI18n } from '@/i18n'
import { routes } from '@/router/routes'

import MobileMenu from './MobileMenu.vue'

const links = [
  { to: '/en/work', label: 'Work' },
  { to: '/en/about', label: 'About' },
]

async function mountMenu() {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push('/en')
  const wrapper = mount(MobileMenu, {
    props: { links },
    attachTo: document.body,
    global: { plugins: [router, createSiteI18n('en')] },
  })
  return { wrapper, router }
}

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.style.overflow = ''
})

describe('MobileMenu', () => {
  it('opens a dialog with the links and locks page scroll', async () => {
    const { wrapper } = await mountMenu()
    const toggle = wrapper.get('button[aria-controls="mobile-menu"]')
    expect(toggle.attributes('aria-expanded')).toBe('false')

    await toggle.trigger('click')

    expect(toggle.attributes('aria-expanded')).toBe('true')
    const dialog = wrapper.get('[role="dialog"]')
    expect(
      dialog
        .get('nav[aria-label="Main"]')
        .findAll('a')
        .map((a) => a.text()),
    ).toEqual(['Work →', 'About →'])
    expect(document.documentElement.style.overflow).toBe('hidden')
  })

  it('closes on Escape and gives focus back to the menu button', async () => {
    const { wrapper } = await mountMenu()
    const toggle = wrapper.get('button[aria-controls="mobile-menu"]')
    await toggle.trigger('click')

    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(document.activeElement).toBe(toggle.element)
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('closes when the visitor navigates', async () => {
    const { wrapper, router } = await mountMenu()
    await wrapper.get('button[aria-controls="mobile-menu"]').trigger('click')

    await router.push('/en/about')
    await flushPromises()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })
})
