<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import ContactForm from '@/components/ContactForm.vue'
import { usePageMeta } from '@/composables/usePageMeta'
import { GITHUB_URL, LINKEDIN_URL } from '@/content/career'

const { t } = useI18n()
usePageMeta('contact', 'contact')

const elsewhere = [
  { href: LINKEDIN_URL, label: 'LinkedIn', handle: 'in/cleriseswart' },
  { href: GITHUB_URL, label: 'GitHub', handle: 'CleriseSwart' },
]
</script>

<template>
  <div class="grid gap-16 pt-12 sm:pt-20 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
    <section class="grid content-start gap-10">
      <header class="grid max-w-[60ch] gap-4">
        <h1 class="text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.95] font-[750] [font-stretch:82%]">
          {{ t('contact.heading') }}
        </h1>
        <p class="text-lg text-fog">{{ t('contact.intro') }}</p>
      </header>
      <ContactForm />
    </section>

    <aside class="grid content-start gap-4 lg:pt-40">
      <p class="label">{{ t('contact.elsewhereLabel') }}</p>
      <ul class="grid gap-3">
        <li v-for="link in elsewhere" :key="link.href">
          <a
            :href="link.href"
            rel="noopener me"
            class="group grid rounded-xl border border-seam p-4 transition-colors hover:border-chalk"
          >
            <span class="font-semibold">{{ link.label }}</span>
            <span class="text-sm text-fog">{{ link.handle }}</span>
          </a>
        </li>
      </ul>
      <p class="text-sm text-fog">{{ t('contact.where') }}</p>
    </aside>
  </div>
</template>
