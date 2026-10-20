import { ViteSSG } from 'vite-ssg'

import App from './App.vue'
import { createSiteI18n } from './i18n'
import { routes } from './router/routes'
import { DEFAULT_LOCALE, isLocale } from './site'
import './styles/main.css'

// vite-ssg builds a fresh app per prerendered page (and once in the browser).
export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
  },
  ({ app, router }) => {
    const i18n = createSiteI18n()
    app.use(i18n)

    // The locale lives in the URL (/en, /af); keep vue-i18n in step with it.
    router.beforeEach((to) => {
      const locale = to.params.locale
      i18n.global.locale.value = isLocale(locale) ? locale : DEFAULT_LOCALE
    })
  },
)
