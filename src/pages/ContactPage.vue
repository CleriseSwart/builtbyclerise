<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import ContactForm from '@/components/ContactForm.vue'
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
      <div class="grid gap-2 rounded-xl border border-seam bg-cloth p-4">
        <span class="text-sm text-fog">{{ t('contact.emailLabel') }}</span>
        <a
          :href="`mailto:${EMAIL}`"
          class="font-semibold break-all text-thread underline-offset-4 hover:underline"
        >
          {{ EMAIL }}
        </a>
        <button type="button" class="w-fit text-sm text-fog hover:text-chalk" @click="copyEmail">
          <span aria-live="polite">{{ copied ? t('contact.copied') : t('contact.copy') }}</span>
        </button>
      </div>
      <ul class="grid gap-3">
        <li v-for="profile in profiles" :key="profile.href">
          <a
            :href="profile.href"
            rel="noopener me"
            class="grid rounded-xl border border-seam p-4 transition-colors hover:border-chalk"
          >
            <span class="font-semibold">{{ profile.label }}</span>
            <span class="text-sm text-fog">{{ profile.handle }}</span>
          </a>
        </li>
      </ul>
      <p class="text-sm text-fog">{{ t('contact.where') }}</p>
    </aside>
  </div>
</template>
