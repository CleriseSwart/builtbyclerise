<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import portrait from '@/assets/portrait.jpg'
import SectionHeading from '@/components/SectionHeading.vue'
import { useLocalePath } from '@/composables/useLocalePath'
import { usePageMeta } from '@/composables/usePageMeta'
import { usePersonSchema } from '@/composables/usePersonSchema'
import { skills, timeline, tools } from '@/content/career'

const { t } = useI18n()
const { locale } = useLocalePath()
usePageMeta('about', 'about')
usePersonSchema()

const entries = computed(() => timeline[locale.value])
const skillGroups = computed(() => skills[locale.value])
const looking = ['about.looking.role', 'about.looking.level', 'about.looking.where'] as const
</script>

<template>
  <div class="grid gap-24 pt-12 sm:pt-20">
    <header class="grid items-center gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div class="grid gap-6">
        <h1 class="text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.95] font-[750] [font-stretch:82%]">
          {{ t('about.heading') }}
        </h1>
        <p class="max-w-[34ch] font-display text-[clamp(1.375rem,2.4vw,1.75rem)] leading-tight">
          {{ t('about.intro') }}
        </p>
        <p class="max-w-[66ch] text-fog">{{ t('about.story') }}</p>
        <p class="max-w-[66ch] text-fog">{{ t('about.business') }}</p>
      </div>
      <!-- The photo is a placeholder for now. -->
      <div class="mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl">
        <img
          :src="portrait"
          :alt="t('about.photoAlt')"
          width="720"
          height="720"
          class="size-full object-cover"
        />
      </div>
    </header>

    <section class="grid gap-10">
      <SectionHeading :label="t('about.timelineLabel')" :heading="t('about.timelineHeading')" />
      <ol class="timeline grid">
        <li
          v-for="entry in entries"
          :key="entry.period + entry.title"
          class="relative grid gap-1 pb-10 pl-10 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8"
          :data-kind="entry.kind"
        >
          <p class="font-mono text-xs tracking-[0.06em] text-fog uppercase sm:pt-1.5">
            {{ entry.period }}
          </p>
          <div class="grid gap-1">
            <h3 class="text-xl font-semibold">{{ entry.title }}</h3>
            <p class="text-sm text-fog">{{ entry.place }}</p>
            <p class="mt-1 max-w-[60ch]">{{ entry.body }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="grid gap-10">
      <SectionHeading :label="t('about.skillsLabel')" :heading="t('about.skillsHeading')" />
      <div class="grid gap-8 md:grid-cols-3">
        <div v-for="group in skillGroups" :key="group.level" class="grid content-start gap-3">
          <h3 class="label">{{ group.level }}</h3>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="skill in group.skills"
              :key="skill"
              class="rounded-full border border-seam bg-cloth px-3 py-1 text-sm"
            >
              {{ skill }}
            </li>
          </ul>
        </div>
      </div>
      <p class="text-sm text-fog">
        <span class="label mr-2">{{ t('about.toolsLabel') }}</span
        >{{ tools.join(' · ') }}
      </p>
    </section>

    <section class="grid gap-8">
      <SectionHeading :label="t('about.lookingLabel')" :heading="t('about.lookingHeading')" />
      <ul class="grid max-w-[66ch] gap-3">
        <li v-for="key in looking" :key="key" class="stitch-bullet">{{ t(key) }}</li>
      </ul>
    </section>

    <section class="grid gap-6">
      <SectionHeading :label="t('about.offLabel')" :heading="t('about.offHeading')">
        <p class="text-fog">{{ t('about.offBody') }}</p>
      </SectionHeading>
      <blockquote
        class="max-w-[28ch] font-display text-[clamp(1.5rem,3vw,2.125rem)] leading-tight font-medium"
      >
        “{{ t('about.cs2') }}”
      </blockquote>
    </section>
  </div>
</template>

<style scoped>
/* The timeline is a running stitch; engineering milestones get a satin-stitch knot. */
.timeline li::before {
  content: '';
  position: absolute;
  left: 0.6rem;
  top: 0.5rem;
  bottom: 0;
  width: 2px;
  background: repeating-linear-gradient(180deg, var(--color-seam) 0 9px, transparent 9px 15px);
}
.timeline li::after {
  content: '';
  position: absolute;
  left: 0.25rem;
  top: 0.35rem;
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 999px;
  border: 2px solid var(--color-fog);
  background: var(--color-ink);
}
.timeline li[data-kind='engineering']::after,
.timeline li[data-kind='study']::after {
  border-color: var(--color-thread);
  background: var(--color-thread);
}
.timeline li:last-child::before {
  display: none;
}
</style>
