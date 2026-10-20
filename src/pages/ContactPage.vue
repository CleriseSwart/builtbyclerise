<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { usePageMeta } from '@/composables/usePageMeta'
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '@/content/career'

const { t } = useI18n()
usePageMeta('contact', 'contact')

const profiles = [
  { href: LINKEDIN_URL, label: 'LinkedIn', handle: 'in/cleriseswart' },
  { href: GITHUB_URL, label: 'GitHub', handle: 'CleriseSwart' },
]

const copied = ref(false)
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Clipboard blocked: the address is still there to select by hand.
  }
}
</script>

<template>
  <div class="grid max-w-3xl gap-12 pt-12 sm:pt-20">
    <header class="grid max-w-[60ch] gap-4">
      <h1 class="text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.95] font-[750] [font-stretch:82%]">
        {{ t('contact.heading') }}
      </h1>
      <p class="text-lg text-fog">{{ t('contact.intro') }}</p>
    </header>

    <section class="grid gap-3 rounded-2xl border border-seam bg-cloth p-6 sm:p-8">
      <p class="label">{{ t('contact.email') }}</p>
      <div class="flex flex-wrap items-center gap-4">
        <a
          :href="`mailto:${EMAIL}`"
          class="font-display text-[clamp(1.375rem,4vw,2.25rem)] font-semibold break-all text-thread underline-offset-4 hover:underline"
        >
          {{ EMAIL }}
        </a>
        <button type="button" class="btn-stitch text-sm" @click="copyEmail">
          <span aria-live="polite">{{ copied ? t('contact.copied') : t('contact.copy') }}</span>
        </button>
      </div>
    </section>

    <ul class="grid gap-3 sm:grid-cols-2">
      <li v-for="profile in profiles" :key="profile.href">
        <a
          :href="profile.href"
          rel="noopener me"
          class="grid rounded-xl border border-seam p-5 transition-colors hover:border-chalk"
        >
          <span class="text-lg font-semibold">{{ profile.label }}</span>
          <span class="text-sm text-fog">{{ profile.handle }}</span>
        </a>
      </li>
    </ul>

    <p class="text-sm text-fog">{{ t('contact.where') }}</p>
  </div>
</template>
