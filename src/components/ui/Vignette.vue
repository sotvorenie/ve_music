<script setup lang="ts">
import {onMounted, ref} from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);

const drawVignette = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, w, h)

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'

  ctx.translate(w * 0.9, h * 0.12)

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

onMounted(() => drawVignette())
</script>

<template>

  <canvas ref="canvasRef" class="position-absolute w-100 h-100 pointer-events-none z-1" />

</template>