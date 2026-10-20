<script setup lang="ts">
import type { CaseStudySlug } from '@/content/types'

// Small line drawings for the project cards: meshing gears for FEW (gear calculations), a grid of
// binding colours sharing one stock for Embroidery Blanks. Decorative only.
const props = defineProps<{ slug: CaseStudySlug }>()

function gearPath(radius: number, teeth: number): string {
  const steps = teeth * 2
  let d = ''
  for (let i = 0; i < steps; i++) {
    const r = i % 2 ? radius : radius + 7
    const a0 = (i / steps) * Math.PI * 2
    const a1 = ((i + 1) / steps) * Math.PI * 2
    const p = (a: number) => `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`
    d += `${i ? 'L' : 'M'}${p(a0)}L${p(a1)}`
  }
  return `${d}Z`
}

const gears = [
  { x: 96, r: 38, d: gearPath(38, 16), stroke: 'stroke-thread', spin: 'spin' },
  { x: 170, r: 26, d: gearPath(26, 11), stroke: 'stroke-chalk', spin: 'spin-back' },
]

const swatches = Array.from({ length: 30 }, (_, i) => ({
  x: 26 + (i % 8) * 28,
  y: 14 + Math.floor(i / 8) * 26,
  on: i === 13,
}))
</script>

<template>
  <svg viewBox="0 0 260 130" aria-hidden="true" focusable="false" class="size-full">
    <template v-if="props.slug === 'few-cutting-tools'">
      <g v-for="gear in gears" :key="gear.x" :transform="`translate(${gear.x} 65)`">
        <path
          :d="gear.d"
          fill="none"
          stroke-width="2"
          stroke-dasharray="5 3"
          :class="[gear.stroke, gear.spin]"
        />
        <circle :r="gear.r * 0.28" fill="none" stroke-width="2" :class="gear.stroke" />
      </g>
    </template>
    <template v-else>
      <rect
        v-for="(s, i) in swatches"
        :key="i"
        :x="s.x"
        :y="s.y"
        width="20"
        height="18"
        rx="4"
        stroke-width="1.5"
        :stroke-dasharray="s.on ? undefined : '3 2'"
        :class="s.on ? 'fill-thread stroke-thread' : 'fill-none stroke-fog'"
      />
    </template>
  </svg>
</template>

<style scoped>
.spin,
.spin-back {
  transform-box: fill-box;
  transform-origin: center;
  animation: spin 9s linear infinite;
}
.spin-back {
  animation-name: spin-back;
  /* 16 : 11 teeth, so the small gear turns faster */
  animation-duration: 6.19s;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes spin-back {
  to {
    transform: rotate(-360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .spin,
  .spin-back {
    animation: none;
  }
}
</style>
