<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { type CaseStudy, caseStudyPath } from '@/content/types'
import { useLocalePath } from '@/composables/useLocalePath'

import CardArt from './CardArt.vue'

// A case study as a collectible card: a nod to Pokémon TCG deck-building.
const props = defineProps<{
  study: CaseStudy
  /** Slight resting tilt in degrees, so a row of cards looks dealt rather than gridded. */
  tilt?: number
}>()

const { t } = useI18n()
const { locale, path } = useLocalePath()

const copy = computed(() => props.study.copy[locale.value])
const domain = computed(() => props.study.links.en[0]?.href.replace(/^https?:\/\//, ''))
</script>

<template>
  <article
    class="card group relative w-[300px] max-w-full rounded-2xl bg-chalk p-2.5 text-ink transition-transform duration-300 motion-reduce:transition-none"
    :style="{ '--tilt': `${tilt ?? 0}deg` }"
  >
    <div class="flex h-full flex-col gap-3 rounded-[10px] bg-ink p-3.5 text-chalk">
      <div class="flex items-baseline justify-between gap-2.5">
        <h3 class="text-[21px] font-bold [font-stretch:85%]">
          <!-- The whole card is the link (see ::after below). -->
          <RouterLink :to="path(caseStudyPath(study.slug))" class="after:absolute after:inset-0">
            {{ study.name }}
          </RouterLink>
        </h3>
        <span
          class="rounded-full bg-thread px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap text-ink uppercase"
        >
          {{ copy.chip }}
        </span>
      </div>
      <div class="h-[130px] overflow-hidden rounded-lg border border-seam bg-cloth">
        <CardArt :slug="study.slug" />
      </div>
      <dl class="grid gap-2 text-[13.5px]">
        <div class="grid gap-px">
          <dt class="label text-[10px]">{{ t('card.stack') }}</dt>
          <dd>{{ study.stack.slice(0, 4).join(' · ') }}</dd>
        </div>
        <div class="grid gap-px">
          <dt class="label text-[10px]">{{ t('card.ability') }}</dt>
          <dd>{{ copy.ability }}</dd>
        </div>
      </dl>
      <div
        class="mt-auto flex justify-between border-t border-dashed border-seam pt-2 font-mono text-[10px] tracking-[0.06em] text-fog"
      >
        <span>{{ domain }}</span>
        <span>{{ copy.status }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  transform: rotate(var(--tilt));
}
.card:hover,
.card:focus-within {
  transform: rotate(0deg) translateY(-6px);
}
</style>
