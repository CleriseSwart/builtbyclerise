<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// A round "back to top" button that appears once the visitor has scrolled a screen or so down.

const { t } = useI18n()
const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > window.innerHeight * 0.8
}

function toTop() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  // Move keyboard focus back to the top too, so the next Tab starts at the header.
  document.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition
    enter-from-class="opacity-0 translate-y-3"
    leave-to-class="opacity-0 translate-y-3"
    enter-active-class="transition duration-300 motion-reduce:transition-none"
    leave-active-class="transition duration-200 motion-reduce:transition-none"
  >
    <button
      v-if="visible"
      type="button"
      class="stitch-ring fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-12 place-items-center rounded-full bg-cloth/90 text-chalk shadow-lg backdrop-blur transition-colors hover:bg-thread hover:text-ink"
      :aria-label="t('nav.backToTop')"
      :title="t('nav.backToTop')"
      @click="toTop"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" class="size-5">
        <path
          d="M12 19V5M5 12l7-7 7 7"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
/* A running-stitch ring around the button, in keeping with the rest of the site. */
.stitch-ring::before {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 999px;
  border: 1.5px dashed var(--color-fog);
  pointer-events: none;
}
</style>
