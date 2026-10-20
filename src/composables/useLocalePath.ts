import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { DEFAULT_LOCALE, isLocale, type Locale, localePath, type PagePath } from '@/site'

/** The active locale (typed) and a helper for links to pages in that locale. */
export function useLocalePath() {
  const { locale } = useI18n()
  const current = computed<Locale>(() => (isLocale(locale.value) ? locale.value : DEFAULT_LOCALE))
  const path = (page: PagePath = '') => localePath(current.value, page)
  return { locale: current, path }
}
