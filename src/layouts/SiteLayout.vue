<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import LanguageToggle from '@/components/LanguageToggle.vue'
import StitchMonogram from '@/components/StitchMonogram.vue'
import { useLocalePath } from '@/composables/useLocalePath'

const { t } = useI18n()
const { path } = useLocalePath()

const REPO_URL = 'https://github.com/CleriseSwart/builtbyclerise'

const links = computed(() => [
  { to: path('work'), label: t('nav.work') },
  { to: path('about'), label: t('nav.about') },
  { to: path('contact'), label: t('nav.contact') },
])
</script>

<template>
  <a
    href="#main"
    class="sr-only z-50 rounded-full bg-chalk px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
  >
    {{ t('site.skipToContent') }}
  </a>

  <div class="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 sm:px-7">
    <header class="flex flex-wrap items-center gap-x-6 gap-y-3 py-5">
      <RouterLink
        :to="path()"
        class="flex items-center gap-2.5 font-display text-[17px] font-semibold"
      >
        <StitchMonogram class="size-[30px]" />
        {{ t('site.name') }}
      </RouterLink>
      <nav :aria-label="t('nav.label')" class="ml-auto hidden gap-6 text-[15px] sm:flex">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-fog transition-colors hover:text-chalk aria-[current=page]:text-chalk"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
      <LanguageToggle class="ml-auto sm:ml-0" />
    </header>

    <main id="main" tabindex="-1" class="flex-1 focus:outline-none">
      <RouterView />
    </main>

    <footer class="mt-24 flex flex-wrap justify-between gap-4 py-8 text-sm text-fog">
      <div class="stitch-rule basis-full" />
      <p>{{ t('footer.builtWith') }}</p>
      <p class="flex gap-4">
        <a :href="REPO_URL" class="underline-offset-4 hover:text-chalk hover:underline">
          {{ t('footer.source') }}
        </a>
        <span>{{ t('footer.location') }}</span>
      </p>
    </footer>
  </div>
</template>
