import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

import type { MessageSchema } from '@/i18n'
import {
  DEFAULT_LOCALE,
  localePath,
  type PagePath,
  SITE_NAME,
  SITE_URL,
  SUPPORTED_LOCALES,
} from '@/site'

import { useLocalePath } from './useLocalePath'

type MetaKey = keyof MessageSchema['meta']

export interface PageMeta {
  title: string
  description: string
}

/**
 * Title, description, canonical URL, hreflang alternates and Open Graph tags for a page.
 * `meta` is a key under `meta.*` in the translations, or a getter for pages whose copy lives in
 * src/content. Pass `page: null` for pages that should not be indexed (the 404).
 */
export function usePageMeta(page: PagePath | null, meta: MetaKey | (() => PageMeta)) {
  const { t } = useI18n<{ message: MessageSchema }>()
  const { locale } = useLocalePath()

  useHead(() => {
    const copy =
      typeof meta === 'function'
        ? meta()
        : { title: t(`meta.${meta}.title`), description: t(`meta.${meta}.description`) }
    const title = page === '' ? copy.title : `${copy.title} · ${SITE_NAME}`
    const url = page === null ? null : `${SITE_URL}${localePath(locale.value, page)}`

    return {
      title,
      htmlAttrs: { lang: locale.value },
      meta: [
        { name: 'description', content: copy.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:title', content: title },
        { property: 'og:description', content: copy.description },
        { property: 'og:locale', content: locale.value === 'af' ? 'af_ZA' : 'en_ZA' },
        ...(url
          ? [{ property: 'og:url', content: url }]
          : [{ name: 'robots', content: 'noindex' }]),
      ],
      link:
        page === null || url === null
          ? []
          : [
              { rel: 'canonical', href: url },
              ...SUPPORTED_LOCALES.map((l) => ({
                rel: 'alternate',
                hreflang: l,
                href: `${SITE_URL}${localePath(l, page)}`,
              })),
              {
                rel: 'alternate',
                hreflang: 'x-default',
                href: `${SITE_URL}${localePath(DEFAULT_LOCALE, page)}`,
              },
            ],
    }
  })
}
