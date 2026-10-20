<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

import type { ContactResponse } from '@/contact/handler'
import {
  CONTACT_TOPICS,
  type ContactErrors,
  type ContactField,
  LIMITS,
  validateContact,
} from '@/contact/validate'
import { useLocalePath } from '@/composables/useLocalePath'

// Cloudflare's "always passes" test key keeps local development working without an account.
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

interface Turnstile {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

const { t } = useI18n()
const { locale } = useLocalePath()

const form = reactive({ name: '', email: '', topic: 'work', message: '', website: '' })
const errors = ref<ContactErrors>({})
const state = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const failure = ref<'captcha' | 'send' | 'network'>('send')
const token = ref('')

const widget = useTemplateRef<HTMLDivElement>('widget')
let widgetId: string | undefined

function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = TURNSTILE_SRC
    script.async = true
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject())
    script.onerror = reject
    document.head.append(script)
  })
}

onMounted(async () => {
  try {
    const turnstile = await loadTurnstile()
    if (!widget.value) return
    widgetId = turnstile.render(widget.value, {
      sitekey: SITE_KEY,
      theme: 'dark',
      language: locale.value,
      callback: (value: string) => (token.value = value),
      'expired-callback': () => (token.value = ''),
    })
  } catch {
    // Without the widget the server refuses the message; the error state explains it.
  }
})
onBeforeUnmount(() => {
  if (widgetId) window.turnstile?.remove(widgetId)
})

const fieldError = (field: ContactField) =>
  errors.value[field] ? t(`contact.errors.${errors.value[field]}`) : ''

async function submit() {
  const result = validateContact(form)
  errors.value = result.ok ? {} : result.errors
  if (!result.ok) return

  state.value = 'sending'
  let response: Response
  try {
    response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...result.data, website: form.website, token: token.value }),
    })
  } catch {
    // Only a request that never got an answer is a connection problem.
    failure.value = 'network'
    state.value = 'error'
    resetCaptcha()
    return
  }

  // Anything that is not our JSON (an error page from a proxy, say) counts as a failed send.
  const body = (await response.json().catch(() => null)) as ContactResponse | null
  if (body?.ok) {
    state.value = 'sent'
    return
  }
  if (body?.error === 'invalid') errors.value = body.errors
  failure.value = body?.error === 'captcha' ? 'captcha' : 'send'
  state.value = 'error'
  resetCaptcha()
}

function resetCaptcha() {
  if (widgetId) window.turnstile?.reset(widgetId)
  token.value = ''
}
</script>

<template>
  <p
    v-if="state === 'sent'"
    role="status"
    class="rounded-2xl border border-seam bg-cloth p-6 text-lg"
  >
    {{ t('contact.sent') }}
  </p>

  <form v-else class="grid gap-6" novalidate @submit.prevent="submit">
    <div class="grid gap-6 sm:grid-cols-2">
      <div class="field">
        <label for="contact-name">{{ t('contact.name') }}</label>
        <input
          id="contact-name"
          v-model="form.name"
          name="name"
          autocomplete="name"
          :maxlength="LIMITS.name"
          :aria-invalid="!!errors.name"
          :aria-describedby="errors.name ? 'contact-name-error' : undefined"
        />
        <p v-if="errors.name" id="contact-name-error" class="error">{{ fieldError('name') }}</p>
      </div>
      <div class="field">
        <label for="contact-email">{{ t('contact.email') }}</label>
        <input
          id="contact-email"
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
          :maxlength="LIMITS.email"
          :aria-invalid="!!errors.email"
          :aria-describedby="errors.email ? 'contact-email-error' : undefined"
        />
        <p v-if="errors.email" id="contact-email-error" class="error">{{ fieldError('email') }}</p>
      </div>
    </div>

    <fieldset class="grid gap-2">
      <legend class="mb-2 text-sm font-semibold">{{ t('contact.topic') }}</legend>
      <div class="flex flex-wrap gap-2">
        <label v-for="topic in CONTACT_TOPICS" :key="topic" class="topic">
          <input v-model="form.topic" type="radio" name="topic" :value="topic" class="sr-only" />
          <span>{{ t(`contact.topics.${topic}`) }}</span>
        </label>
      </div>
    </fieldset>

    <div class="field">
      <label for="contact-message">{{ t('contact.message') }}</label>
      <textarea
        id="contact-message"
        v-model="form.message"
        name="message"
        rows="6"
        :maxlength="LIMITS.message"
        :aria-invalid="!!errors.message"
        :aria-describedby="errors.message ? 'contact-message-error' : undefined"
      />
      <p v-if="errors.message" id="contact-message-error" class="error">
        {{ fieldError('message') }}
      </p>
    </div>

    <!-- Honeypot: hidden from people and screen readers, irresistible to bots. -->
    <div class="hidden" aria-hidden="true">
      <label for="contact-website">Website</label>
      <input
        id="contact-website"
        v-model="form.website"
        name="website"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <div ref="widget" class="min-h-[65px]" />

    <p v-if="state === 'error'" role="alert" class="error">
      {{ t(`contact.errors.${failure}`) }}
    </p>

    <div>
      <button type="submit" class="btn-thread" :disabled="state === 'sending'">
        {{ state === 'sending' ? t('contact.sending') : t('contact.send') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
@reference '../styles/main.css';

.field {
  @apply grid gap-2;
}
.field label {
  @apply text-sm font-semibold;
}
.field input,
.field textarea {
  @apply w-full rounded-xl border border-seam bg-cloth px-4 py-3 text-chalk transition-colors outline-none;
}
.field input:focus,
.field textarea:focus {
  @apply border-thread;
}
.field [aria-invalid='true'] {
  @apply border-thread;
}
.error {
  @apply text-sm text-thread;
}
.topic span {
  @apply inline-flex cursor-pointer rounded-full border border-seam px-4 py-2 text-sm text-fog transition-colors;
}
.topic input:checked + span {
  @apply border-chalk bg-chalk text-ink;
}
.topic input:focus-visible + span {
  @apply outline-2 outline-offset-4 outline-thread;
}
</style>
