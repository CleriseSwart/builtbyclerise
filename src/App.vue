<script setup lang="ts">
import bricolage from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2?url'
import figtree from '@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2?url'
import { useHead } from '@unhead/vue'

// Preload the two Latin font files every page needs, so text does not wait for the CSS to ask for them.
useHead({
  link: [bricolage, figtree].map((href) => ({
    rel: 'preload',
    as: 'font',
    type: 'font/woff2',
    href,
    crossorigin: 'anonymous',
  })),
})
</script>

<template>
  <RouterView />
</template>
