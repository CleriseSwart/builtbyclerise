<script setup lang="ts">
import { satinArc, toSvgPoints } from '@/utils/satin'

// The site's mark: a satin-stitched "C" inside a running-stitch hoop. Decorative only.
const points = toSvgPoints(satinArc({ points: 61, radius: 1, width: 0.55 }))
</script>

<template>
  <svg viewBox="-1.6 -1.6 3.2 3.2" aria-hidden="true" focusable="false">
    <polyline
      :points="points"
      fill="none"
      class="stroke-thread"
      stroke-width="0.07"
      stroke-linejoin="round"
    />
    <circle
      r="1.45"
      fill="none"
      class="stroke-fog"
      stroke-width="0.06"
      stroke-dasharray="0.18 0.12"
    />
  </svg>
</template>
