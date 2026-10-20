<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useLocalePath } from '@/composables/useLocalePath'
import { usePageMeta } from '@/composables/usePageMeta'

const { t } = useI18n()
const { path } = useLocalePath()
usePageMeta(null, 'notFound')
</script>

<template>
  <section class="grid gap-4 py-12 sm:py-20">
    <h1 class="text-5xl font-bold">{{ t('notFound.title') }}</h1>
    <p class="text-fog">{{ t('notFound.body') }}</p>
    <RouterLink :to="path()" class="text-thread underline underline-offset-4">
      {{ t('notFound.back') }}
    </RouterLink>
  </section>
</template>
