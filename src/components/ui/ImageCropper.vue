<script setup lang="ts">
import {onUnmounted, ref, watch} from 'vue';
import { Cropper } from 'vue-advanced-cropper';

import {showError} from "@utils/modals.ts";

import ButtonUi from "@ui/ButtonUi.vue";

const props = withDefaults(
    defineProps<{
      file: File | null
      aspectRatio?: string
    }>(), {
      aspectRatio: '1',
    }
)

const emit = defineEmits<{
  cropped: [croppedFile: File],
  cancel: [],
}>()

const URL = window.URL

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)

const rotateAngle = ref<number>(0)
let prevRotateAngle: number = 0

const imgSrc = ref('')

const crop = () => {
  if (!cropperRef.value) return

  const { canvas } = cropperRef.value.getResult()
  if (!canvas) return

  canvas.toBlob(
      (blob) => {
        if (!blob) {
          onError()
          return
        }
        const croppedFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
        emit('cropped', croppedFile)
      },
      'image/jpeg',
      0.9
  )
}

const onError = () => {
  showError(
      'Ошибка обрезки фото',
      'Не удалось обрезать фото..'
  )
}

const onRotate = () => {
  if (!cropperRef.value || !props.file) return

  const diff = rotateAngle.value - prevRotateAngle
  cropperRef.value.rotate(diff)
  prevRotateAngle = rotateAngle.value
}

watch(
    () => props.file,
    (file) => {
      rotateAngle.value = 0
      prevRotateAngle = 0
      if (imgSrc.value) URL.revokeObjectURL(imgSrc.value)
      imgSrc.value = file ? URL.createObjectURL(file) : ''
    },
    { immediate: true }
)

onUnmounted(() => {
  if (imgSrc.value) URL.revokeObjectURL(imgSrc.value)
})
</script>

<template>
  <div class="w-120 mx-auto">
    <div class="h-120 bg-dark-alt">
      <cropper
          v-if="file"
          ref="cropperRef"
          :src="imgSrc"
          :stencil-props="{ aspectRatio: aspectRatio }"
          :canvas="true"
          @error="onError"
          class="h-full"
      />
    </div>

    <div class="bg-dark-alt mb-5 p-2 rounded-b-regular">
      <div class="flex items-center gap-3">
        <span>Повернуть:</span>

        <span>{{rotateAngle}} °</span>
      </div>

      <input class="range-slider w-full"
             v-model="rotateAngle"
             :min="0"
             :max="360"
             :step="1"
             :style="{'--percent': `${rotateAngle / 360 * 100}%`}"
             type="range"
             @change="onRotate"
      >
    </div>

    <div class="grid grid-cols-2 gap-3">
      <ButtonUi @click="emit('cancel')">
        Отмена
      </ButtonUi>

      <ButtonUi @click="crop">
        Готово
      </ButtonUi>
    </div>
  </div>
</template>