import { createI18n } from 'vue-i18n'

import { DEFAULT_LOCALE, type Locale } from '@/site'

import af from './af.json'
import en from './en.json'

// en.json is the schema; af.json must have exactly the same keys or `vue-tsc` fails the build
// (scripts/check-i18n.mjs additionally diffs the two files and fails `npm run build`).
export type MessageSchema = typeof en
type Assert<T extends true> = T
export type AfrikaansIsComplete = Assert<typeof af extends MessageSchema ? true : false>

// Both locales are small and every page is prerendered in both, so they ship together.
export function createSiteI18n(locale: Locale = DEFAULT_LOCALE) {
  return createI18n<[MessageSchema], Locale, false>({
    legacy: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    messages: { en, af },
  })
}
