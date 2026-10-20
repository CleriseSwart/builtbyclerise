<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { type RouteLocationRaw, useRoute } from 'vue-router'

import { DEFAULT_LOCALE, isLocale, type Locale, localePath, SUPPORTED_LOCALES } from '@/site'

const { t } = useI18n()
const route = useRoute()

const current = computed<Locale>(() =>
  isLocale(route.params.locale) ? route.params.locale : DEFAULT_LOCALE,
)

// Same page in the other language; pages outside /:locale (the 404) fall back to that locale's home.
function linkFor(locale: Locale): RouteLocationRaw {
  return isLocale(route.params.locale) && route.name
    ? { name: route.name, params: { ...route.params, locale } }
    : localePath(locale)
}
</script>

<template>
  <nav :aria-label="t('nav.language')" class="flex rounded-full border border-seam p-[3px]">
    <RouterLink
      v-for="locale in SUPPORTED_LOCALES"
      :key="locale"
      :to="linkFor(locale)"
      :hreflang="locale"
      :lang="locale"
      :aria-current="locale === current ? 'true' : undefined"
      :title="locale === current ? undefined : t('nav.switchTo')"
      class="rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors"
      :class="locale === current ? 'bg-chalk text-ink' : 'text-fog hover:text-chalk'"
    >
      {{ locale }}
    </RouterLink>
  </nav>
</template>
