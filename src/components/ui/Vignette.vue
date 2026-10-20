<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import useControllersStore from "@store/useControllersStore.ts";
const controllersStore = useControllersStore()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const viewportW = ref(0)

const SHIFT_RATIO = 0.18

const canvasTransform = computed(() => {
  const w = viewportW.value
  if (!w) return 'translateX(0)'
  return controllersStore.mode === 'img'
      ? 'translateX(0)'
      : `translateX(${-w * SHIFT_RATIO}px)`
})

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const dpr = window.devicePixelRatio || 1
  const w = window.innerWidth
  const h = window.innerHeight
  const extra = w * SHIFT_RATIO

  viewportW.value = w

  canvas.width = (w + extra) * dpr
  canvas.height = h * dpr
  canvas.style.width = (w + extra) + 'px'
  canvas.style.height = h + 'px'

  drawVignette(w, h, extra, dpr)
}

const drawVignette = (w: number, h: number, extra: number, dpr: number) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w + extra, h)

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, w + extra, h)

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'

  const cx = w * 0.98
  const cy = h * 0.15

  ctx.translate(cx, cy)
  ctx.scale(1.2, 1)

  const radius = w * 0.65
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 1)')
  gradient.addColorStop(0.1, 'rgba(0, 0, 0, 0.9)')
  gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.3)')
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

const handleResize = () => resizeCanvas()

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <canvas
      ref="canvasRef"
      class="absolute top-0 left-0 h-full pointer-events-none z-1 will-change-transform transition-transform duration-1200"
      :style="{ transform: canvasTransform }"
  />
</template>