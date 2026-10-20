<script setup lang="ts">
defineProps<{
  label: string
  heading: string
  /** Heading level; sections under a page's h1 use h2. */
  as?: 'h1' | 'h2'
}>()
</script>

<template>
  <div class="grid max-w-[70ch] gap-2.5">
    <p class="label">{{ label }}</p>
    <component
      :is="as ?? 'h2'"
      class="text-[clamp(1.875rem,4vw,2.75rem)] leading-tight font-bold tracking-[-0.01em] [font-stretch:88%]"
    >
      {{ heading }}
    </component>
    <slot />
  </div>
</template>
