<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'

import HoopScene from './HoopScene.vue'

// The WebGL part of the hero, split out so Three.js and TresJS load only on the home page, after
// first paint (HeroHoop.vue imports this lazily).

defineProps<{
  colour: string
  run: number
  pointer: { x: number; y: number }
  reducedMotion: boolean
  active: boolean
}>()

const emit = defineEmits<{ stitches: [shown: number, total: number] }>()
</script>

<template>
  <TresCanvas :alpha="true" clear-color="#00000000" :dpr="[1, 2]" :antialias="true">
    <HoopScene
      :colour="colour"
      :run="run"
      :pointer="pointer"
      :reduced-motion="reducedMotion"
      :active="active"
      @stitches="(shown, total) => emit('stitches', shown, total)"
    />
  </TresCanvas>
</template>
