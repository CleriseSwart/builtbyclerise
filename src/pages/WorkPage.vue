<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import ProjectCard from '@/components/ProjectCard.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import { useLocalePath } from '@/composables/useLocalePath'
import { usePageMeta } from '@/composables/usePageMeta'
import { ETSY_URL, sideWork, sterrkWork } from '@/content/career'
import { caseStudyList } from '@/content/caseStudies'

const { t } = useI18n()
const { locale } = useLocalePath()
usePageMeta('work', 'work')

const sterrk = computed(() => sterrkWork[locale.value])
const side = computed(() => sideWork[locale.value])
</script>

<template>
  <div class="grid gap-24 pt-12 sm:pt-20">
    <header class="grid max-w-[66ch] gap-4">
      <h1 class="text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.95] font-[750] [font-stretch:82%]">
        {{ t('work.heading') }}
      </h1>
      <p class="text-lg text-fog">{{ t('work.intro') }}</p>
    </header>

    <section class="grid gap-10">
      <SectionHeading :label="t('work.caseLabel')" :heading="t('home.workHeading')" />
      <div class="grid gap-10 md:grid-cols-2">
        <div v-for="(study, i) in caseStudyList" :key="study.slug" class="grid content-start gap-5">
          <ProjectCard :study="study" :tilt="i % 2 ? 1.5 : -2" />
          <p class="max-w-[48ch] text-fog">{{ study.copy[locale].tagline }}</p>
        </div>
      </div>
    </section>

    <section class="grid gap-8">
      <SectionHeading :label="t('work.sterrkLabel')" :heading="t('work.sterrkHeading')">
        <p class="text-fog">{{ t('work.sterrkIntro') }}</p>
      </SectionHeading>
      <dl class="grid gap-x-10 md:grid-cols-2">
        <div
          v-for="item in sterrk"
          :key="item.name"
          class="grid gap-1 border-t border-dashed border-seam py-5"
        >
          <dt class="font-display text-xl font-semibold">{{ item.name }}</dt>
          <dd class="text-fog">{{ item.body }}</dd>
        </div>
      </dl>
    </section>

    <section class="grid gap-8">
      <SectionHeading :label="t('work.sideLabel')" :heading="t('work.sideHeading')">
        <p class="text-fog">{{ t('work.sideIntro') }}</p>
      </SectionHeading>
      <dl class="grid gap-x-10 md:grid-cols-2">
        <div
          v-for="item in side"
          :key="item.name"
          class="grid gap-1 border-t border-dashed border-seam py-5"
        >
          <dt class="font-display text-xl font-semibold">{{ item.name }}</dt>
          <dd class="text-fog">{{ item.body }}</dd>
        </div>
      </dl>
      <a :href="ETSY_URL" class="link-arrow" rel="noopener">{{ t('work.etsy') }}</a>
    </section>
  </div>
</template>
