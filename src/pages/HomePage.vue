<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import ProjectCard from '@/components/ProjectCard.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import { useLocalePath } from '@/composables/useLocalePath'
import { usePageMeta } from '@/composables/usePageMeta'
import { usePersonSchema } from '@/composables/usePersonSchema'
import { caseStudyList } from '@/content/caseStudies'
import HeroHoop from '@/hero/HeroHoop.vue'

const { t } = useI18n()
const { path } = useLocalePath()
usePageMeta('', 'home')
usePersonSchema()

const principles = [
  { title: 'home.how.fitTitle', body: 'home.how.fitBody' },
  { title: 'home.how.proofTitle', body: 'home.how.proofBody' },
  { title: 'home.how.docsTitle', body: 'home.how.docsBody' },
] as const
</script>

<template>
  <div class="grid gap-24 sm:gap-32">
    <section
      class="grid items-center gap-10 pt-12 sm:pt-16 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
    >
      <div class="grid gap-6">
        <p class="font-mono text-xs tracking-[0.1em] text-thread uppercase">
          {{ t('home.eyebrow') }}
        </p>
        <h1
          class="text-[clamp(3rem,7.4vw,5.75rem)] leading-[0.92] font-[750] tracking-[-0.02em] [font-stretch:82%]"
        >
          Clérise<br />Swart<span class="text-thread">.</span>
        </h1>
        <p class="max-w-[22ch] font-display text-[clamp(1.375rem,2.4vw,1.75rem)] leading-tight">
          {{ t('home.lede') }}
        </p>
        <p class="max-w-[46ch] text-fog">{{ t('home.sub') }}</p>
        <div class="flex flex-wrap items-center gap-3">
          <RouterLink :to="path('work')" class="btn-thread">{{ t('home.ctaWork') }}</RouterLink>
          <RouterLink :to="path('contact')" class="btn-stitch">{{
            t('home.ctaContact')
          }}</RouterLink>
        </div>
        <p class="status-dot text-sm text-fog">{{ t('home.status') }}</p>
      </div>
      <HeroHoop />
    </section>

    <section class="grid gap-10">
      <SectionHeading :label="t('home.workLabel')" :heading="t('home.workHeading')" />
      <div class="flex flex-wrap gap-6">
        <ProjectCard
          v-for="(study, i) in caseStudyList"
          :key="study.slug"
          :study="study"
          :tilt="i % 2 ? 1.5 : -2"
        />
      </div>
      <RouterLink :to="path('work')" class="link-arrow">{{ t('home.workAll') }}</RouterLink>
    </section>

    <section class="grid gap-10">
      <SectionHeading :label="t('home.howLabel')" :heading="t('home.howHeading')" />
      <ol class="grid gap-6 md:grid-cols-3">
        <li
          v-for="item in principles"
          :key="item.title"
          class="grid content-start gap-3 rounded-2xl border border-seam bg-cloth p-6"
        >
          <h3 class="text-xl font-semibold">{{ t(item.title) }}</h3>
          <p class="text-fog">{{ t(item.body) }}</p>
        </li>
      </ol>
    </section>

    <section class="grid gap-6">
      <SectionHeading :label="t('home.aboutLabel')" :heading="t('home.aboutHeading')">
        <p class="text-fog">{{ t('home.aboutBody') }}</p>
      </SectionHeading>
      <RouterLink :to="path('about')" class="link-arrow">{{ t('home.aboutLink') }}</RouterLink>
    </section>

    <section class="grid gap-5 rounded-3xl border border-seam bg-cloth p-8 sm:p-12">
      <h2 class="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-bold">
        {{ t('home.contactHeading') }}
      </h2>
      <p class="max-w-[52ch] text-fog">{{ t('home.contactBody') }}</p>
      <div>
        <RouterLink :to="path('contact')" class="btn-thread">{{
          t('home.contactLink')
        }}</RouterLink>
      </div>
    </section>
  </div>
</template>
