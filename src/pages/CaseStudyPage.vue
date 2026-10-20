<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useLocalePath } from '@/composables/useLocalePath'
import { usePageMeta } from '@/composables/usePageMeta'
import { caseStudies, caseStudyList } from '@/content/caseStudies'
import { type CaseStudySlug, caseStudyPath } from '@/content/types'

const props = defineProps<{ slug: CaseStudySlug }>()

const { t } = useI18n()
const { locale, path } = useLocalePath()

const study = computed(() => caseStudies[props.slug])
const copy = computed(() => study.value.copy[locale.value])
const links = computed(() => study.value.links[locale.value])
const next = computed(() => {
  const i = caseStudyList.findIndex((s) => s.slug === props.slug)
  return caseStudyList[(i + 1) % caseStudyList.length]!
})
const hasDemo = computed(() => links.value.some((l) => l.href.includes('builtbyclerise.co.za')))

usePageMeta(caseStudyPath(props.slug), () => ({
  title: study.value.name,
  description: copy.value.summary,
}))
</script>

<template>
  <article class="grid gap-16 pt-12 sm:pt-20">
    <header class="grid gap-6">
      <RouterLink :to="path('work')" class="label w-fit hover:text-chalk">
        ← {{ t('case.allWork') }}
      </RouterLink>
      <div class="flex flex-wrap items-center gap-3">
        <span
          class="rounded-full bg-thread px-2.5 py-0.5 font-mono text-[11px] tracking-[0.08em] text-ink uppercase"
        >
          {{ copy.chip }}
        </span>
        <span class="label">{{ copy.status }}</span>
      </div>
      <h1 class="text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.92] font-[750] [font-stretch:82%]">
        {{ study.name }}
      </h1>
      <p class="max-w-[30ch] font-display text-[clamp(1.375rem,2.4vw,1.75rem)] leading-tight">
        {{ copy.tagline }}
      </p>
      <p class="max-w-[66ch] text-lg text-fog">{{ copy.summary }}</p>
    </header>

    <dl class="grid gap-6 rounded-2xl border border-seam bg-cloth p-6 sm:grid-cols-3">
      <div class="grid content-start gap-1">
        <dt class="label">{{ t('case.role') }}</dt>
        <dd>{{ copy.role }}</dd>
      </div>
      <div class="grid content-start gap-1">
        <dt class="label">{{ t('case.stack') }}</dt>
        <dd>
          <ul class="flex flex-wrap gap-1.5">
            <li
              v-for="tech in study.stack"
              :key="tech"
              class="rounded-full border border-seam px-2.5 py-0.5 text-sm"
            >
              {{ tech }}
            </li>
          </ul>
        </dd>
      </div>
      <div class="grid content-start gap-1">
        <dt class="label">{{ t('case.links') }}</dt>
        <dd class="grid gap-1">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            rel="noopener"
            class="text-thread underline-offset-4 hover:underline"
          >
            {{ link.label }}
          </a>
          <p v-if="hasDemo" class="text-sm text-fog">{{ t('case.demoNote') }}</p>
        </dd>
      </div>
    </dl>

    <section
      v-for="section in copy.sections"
      :key="section.heading"
      class="grid max-w-[66ch] gap-4"
    >
      <h2 class="text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold [font-stretch:88%]">
        {{ section.heading }}
      </h2>
      <p v-for="(paragraph, i) in section.paragraphs" :key="i" class="text-chalk/90">
        {{ paragraph }}
      </p>
      <ul v-if="section.points" class="grid gap-3">
        <li v-for="(point, i) in section.points" :key="i" class="stitch-bullet text-fog">
          {{ point }}
        </li>
      </ul>
    </section>

    <section class="grid gap-5 rounded-2xl border border-seam bg-cloth p-6 sm:p-8">
      <h2 class="text-2xl font-bold">{{ t('case.notesHeading') }}</h2>
      <ul class="grid gap-3">
        <li v-for="(note, i) in copy.notes" :key="i" class="stitch-bullet text-fog">
          {{ note }}
        </li>
      </ul>
    </section>

    <nav class="stitch-rule-top flex flex-wrap justify-between gap-4 pt-8">
      <RouterLink :to="path('work')" class="label hover:text-chalk">
        ← {{ t('case.allWork') }}
      </RouterLink>
      <RouterLink :to="path(caseStudyPath(next.slug))" class="link-arrow">
        {{ t('case.next') }}: {{ next.name }}
      </RouterLink>
    </nav>
  </article>
</template>
