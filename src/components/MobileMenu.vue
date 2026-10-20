<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { EMAIL } from '@/content/career'

import LanguageToggle from './LanguageToggle.vue'

// The small-screen navigation: a button in the header that opens a full-screen panel.
// Escape, a link or a route change closes it; focus stays inside while it is open and returns
// to the button afterwards.

defineProps<{ links: { to: string; label: string }[] }>()

const { t } = useI18n()
const route = useRoute()

const open = ref(false)
const toggleButton = useTemplateRef<HTMLButtonElement>('toggleButton')
const panel = useTemplateRef<HTMLElement>('panel')

function focusables(): HTMLElement[] {
  return [...(panel.value?.querySelectorAll<HTMLElement>('a[href], button') ?? [])]
}

async function show() {
  open.value = true
  document.documentElement.style.overflow = 'hidden'
  await nextTick()
  focusables()[0]?.focus()
}

function hide(returnFocus = true) {
  if (!open.value) return
  open.value = false
  document.documentElement.style.overflow = ''
  if (returnFocus) toggleButton.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') return hide()
  if (event.key !== 'Tab') return
  // Keep Tab cycling inside the open panel.
  const items = focusables()
  const first = items[0]
  const last = items.at(-1)
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

watch(
  () => route.fullPath,
  () => hide(false),
)
onBeforeUnmount(() => hide(false))
</script>

<template>
  <button
    ref="toggleButton"
    type="button"
    class="grid size-10 place-items-center rounded-full border border-seam text-chalk sm:hidden"
    :aria-label="t('nav.openMenu')"
    aria-controls="mobile-menu"
    :aria-expanded="open"
    @click="show"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" class="size-5">
      <path
        d="M4 7h16M4 12h16M4 17h10"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </button>

  <Transition
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    enter-active-class="transition-opacity duration-200 motion-reduce:transition-none"
    leave-active-class="transition-opacity duration-150 motion-reduce:transition-none"
  >
    <div
      v-if="open"
      id="mobile-menu"
      ref="panel"
      role="dialog"
      aria-modal="true"
      :aria-label="t('nav.menu')"
      class="linen fixed inset-0 z-50 flex flex-col bg-ink px-[max(1rem,env(safe-area-inset-left))] pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:hidden"
      @keydown="onKeydown"
    >
      <div class="flex items-center justify-between">
        <p class="label">{{ t('nav.menu') }}</p>
        <button
          type="button"
          class="grid size-10 place-items-center rounded-full border border-seam text-chalk"
          :aria-label="t('nav.closeMenu')"
          @click="hide()"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="size-5">
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <nav :aria-label="t('nav.label')" class="mt-10 grid">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="menu-link flex items-baseline justify-between py-5 font-display text-[2.75rem] leading-none font-bold [font-stretch:85%] aria-[current=page]:text-thread"
          @click="hide(false)"
        >
          {{ link.label }}
          <span class="text-2xl text-fog" aria-hidden="true">→</span>
        </RouterLink>
      </nav>

      <div class="mt-auto grid gap-4">
        <LanguageToggle class="w-fit" />
        <a :href="`mailto:${EMAIL}`" class="text-sm break-all text-fog">{{ EMAIL }}</a>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Running-stitch dividers between the menu links. */
.menu-link {
  background: repeating-linear-gradient(90deg, var(--color-seam) 0 9px, transparent 9px 15px)
    bottom / 100% 2px no-repeat;
}
.linen {
  background-image:
    repeating-linear-gradient(0deg, rgb(255 255 255 / 0.018) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(90deg, rgb(255 255 255 / 0.018) 0 1px, transparent 1px 3px);
}
</style>
