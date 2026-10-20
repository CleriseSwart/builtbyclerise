<script setup lang="ts">
import {
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  useTemplateRef,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { satinArc, toSvgPoints } from '@/utils/satin'

import { SATIN } from './stitchPath'

// The home-page hero: an embroidery machine stitching the "C" monogram.
// The prerendered HTML shows a finished SVG version; in the browser the 3D machine loads after
// first paint (when WebGL is available) and fades in over it. Click to stitch again in a new colour.

const HoopCanvas = defineAsyncComponent(() => import('./HoopCanvas.vue'))

const THREADS = [
  { hex: '#ff5c8a', name: 'RASPBERRY' },
  { hex: '#ffb03b', name: 'MARIGOLD' },
  { hex: '#56d6c3', name: 'SEAGREEN' },
  { hex: '#a993ff', name: 'LAVENDER' },
  { hex: '#efebe4', name: 'CHALK' },
] as const

const { t } = useI18n()

const wrapper = useTemplateRef<HTMLButtonElement>('wrapper')
const fallbackPoints = toSvgPoints(satinArc(SATIN))

const use3d = ref(false)
const ready = ref(false)
/** The SVG stand-in is removed once the 3D version has faded in over it. */
const fallbackGone = ref(false)
const active = ref(true)
const reducedMotion = ref(false)
const run = ref(0)
const threadIndex = ref(0)
const pointer = reactive({ x: 0, y: 0 })
const count = reactive({ shown: 0, total: 0 })

const pad = (n: number) => String(n).padStart(3, '0')

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

let observer: IntersectionObserver | undefined

onMounted(() => {
  reducedMotion.value = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!supportsWebGL()) return
  // Wait for the page to finish loading, then for an idle moment, so the 3D bundle never competes
  // with the content.
  const start = () => (use3d.value = true)
  const whenIdle = () =>
    'requestIdleCallback' in window
      ? requestIdleCallback(start, { timeout: 2000 })
      : setTimeout(start, 300)
  if (document.readyState === 'complete') whenIdle()
  else addEventListener('load', whenIdle, { once: true })

  observer = new IntersectionObserver(([entry]) => (active.value = !!entry?.isIntersecting))
  if (wrapper.value) observer.observe(wrapper.value)
})
onBeforeUnmount(() => observer?.disconnect())

function onStitches(shown: number, total: number) {
  count.shown = shown
  count.total = total
  if (ready.value) return
  ready.value = true
  setTimeout(() => (fallbackGone.value = true), reducedMotion.value ? 0 : 700)
}

function restitch() {
  if (!use3d.value) return
  threadIndex.value = (threadIndex.value + 1) % THREADS.length
  run.value++
}

function onPointerMove(event: PointerEvent) {
  const box = (event.currentTarget as HTMLElement).getBoundingClientRect()
  pointer.x = ((event.clientX - box.left) / box.width - 0.5) * 2
  pointer.y = ((event.clientY - box.top) / box.height - 0.5) * 2
}
</script>

<template>
  <button
    ref="wrapper"
    type="button"
    class="hoop relative aspect-square w-full max-w-[560px] cursor-pointer justify-self-center"
    :aria-label="t('home.hoop.restitch')"
    @click="restitch"
    @pointermove="onPointerMove"
    @pointerleave="pointer.x = pointer.y = 0"
  >
    <svg
      v-if="!fallbackGone"
      viewBox="-2.4 -2.4 4.8 4.8"
      aria-hidden="true"
      class="absolute inset-0 size-full transition-opacity duration-700 motion-reduce:transition-none"
      :class="{ 'opacity-0': ready }"
    >
      <circle r="2.15" class="fill-cloth stroke-[#d8cfc0]" stroke-width="0.1" />
      <circle
        r="1.78"
        fill="none"
        class="stroke-fog"
        stroke-width="0.035"
        stroke-dasharray="0.11 0.075"
      />
      <polyline :points="fallbackPoints" fill="none" class="stroke-thread" stroke-width="0.05" />
    </svg>

    <div
      v-if="use3d"
      class="absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none"
      :class="ready ? 'opacity-100' : 'opacity-0'"
    >
      <HoopCanvas
        :colour="THREADS[threadIndex]!.hex"
        :run="run"
        :pointer="pointer"
        :reduced-motion="reducedMotion"
        :active="active"
        @stitches="onStitches"
      />
    </div>

    <span
      v-if="ready"
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-1.5 bottom-1 flex flex-wrap justify-between gap-2 font-mono text-[11px] tracking-[0.08em] text-fog tabular-nums"
    >
      <span class="rounded-md bg-ink/70 px-2 py-1">
        STITCH {{ pad(count.shown) }}/{{ pad(count.total) }}
      </span>
      <span class="rounded-md bg-ink/70 px-2 py-1">SATIN · {{ THREADS[threadIndex]!.name }}</span>
    </span>
  </button>
</template>
