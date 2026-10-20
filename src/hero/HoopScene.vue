<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { onBeforeUnmount, watch } from 'vue'

import { buildMachine, FRAME_SCALE } from './buildMachine'
import {
  advance,
  initialState,
  type MachinePlan,
  needleHeight,
  restart,
  stitchesShown,
} from './machine'
import { monogramStitches } from './stitchPath'

// Lives inside <TresCanvas>: owns the Three.js objects and drives them from the machine state.

const props = defineProps<{
  /** Thread colour for the satin stitch. */
  colour: string
  /** Bump to stitch the monogram again. */
  run: number
  /** Pointer position over the hoop, -1..1 on both axes. */
  pointer: { x: number; y: number }
  reducedMotion: boolean
  /** Pause the render loop while the hero is off screen. */
  active: boolean
}>()

const emit = defineEmits<{ stitches: [shown: number, total: number] }>()

const stitches = monogramStitches()
const plan: MachinePlan = {
  ends: stitches.map((s) => [s.to[0] * FRAME_SCALE, s.to[1] * FRAME_SCALE] as const),
  satinCount: stitches.filter((s) => s.kind === 'satin').length,
  reducedMotion: props.reducedMotion,
}
const machine = buildMachine(stitches)
let state = initialState(plan)
let shown = -1

watch(() => props.colour, machine.setThreadColour, { immediate: true })
watch(
  () => props.run,
  () => (state = restart(state, plan)),
)

const { onBeforeRender, start, stop } = useLoop()
watch(
  () => props.active,
  (active) => (active ? start() : stop()),
)

onBeforeRender(({ delta }) => {
  state = advance(state, Math.min(delta, 0.05), plan)
  const n = stitchesShown(state, plan)
  if (n !== shown) {
    shown = n
    machine.showStitches(n)
    emit('stitches', n, plan.ends.length)
  }
  machine.pose(state.frameX, state.frameY, needleHeight(state, plan), state.headLift)
  if (!props.reducedMotion) {
    machine.lean(props.pointer.x, props.pointer.y, 1 - Math.pow(0.94, Math.min(delta, 0.05) * 60))
  }
})

onBeforeUnmount(machine.dispose)
</script>

<template>
  <TresPerspectiveCamera :fov="30" :position="[0, 0.2, 11.5]" :look-at="[0, 0.55, 0]" />
  <!-- Physically based light units: these match the design mock's look. -->
  <TresAmbientLight :intensity="1.7" />
  <TresDirectionalLight :position="[-3, 5, 6]" :intensity="3" />
  <TresDirectionalLight color="#9fb0ff" :position="[4, -3, 2]" :intensity="1.25" />
  <primitive :object="machine.root" />
</template>
