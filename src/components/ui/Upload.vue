<script setup lang="ts">
import {ref} from "vue";

const props = withDefaults(
    defineProps<{
      disabled: boolean
      accept?: string
      multiple?: boolean
      showFiles?: boolean
    }>(), {
      disabled: true,
      multiple: false,
      showFiles: false,
    }
)

const emits = defineEmits<{
  select: [files: File[]]
}>()

const isDragging = ref(false)
const files = ref<File[]>([])

const isValidType = (file: File): boolean => {
  if (!props.accept) return true

  const types = props.accept.split(',').map(type => type.trim().toLowerCase())
  const fileName = file.name
  const fileType = file.type

  return types.some(type => {
    if (type.startsWith('.')) {
      return fileName.endsWith(type)
    }
    if (type.endsWith('/*')) {
      const category = type.slice(0, -2)
      return fileType.startsWith(category)
    }
    return fileType === type
  })
}

const handleFiles = (fileList: FileList | null) => {
  if (!fileList || props.disabled) return

  const newFiles = Array.from(fileList).filter(isValidType)
  if (!newFiles.length) return

  files.value = props.multiple
      ? [...files.value, ...newFiles]
      : [newFiles[newFiles.length - 1]]

  emits('select', files.value)
}

const onDrop = (e: DragEvent) => {
  if (props.disabled) return

  isDragging.value = false
  if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files)
}

const onChange = (e: Event) => {
  if (props.disabled) return

  const target = e.target as HTMLInputElement
  if (target?.files) handleFiles(target.files)
}

const handleDelete = (index: number) => {
  if (props.disabled) return

  files.value.splice(index, 1)
  emits('select', files.value)
}

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} КБ`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}
</script>

<template>

  <div class="upload flex flex-column">
    <label @dragenter.prevent="isDragging = true"
           @dragleave.prevent="isDragging = false"
           @dragover.prevent
           @drop.prevent="onDrop"
           class="upload__label cursor-pointer"
           :class="[
               isDragging && 'is-accent',
           ]"
    >
      <input type="file"
             class="visually-hidden"
             :multiple="multiple"
             :accept="accept"
             :disabled="disabled"
             @change="onChange"
      >
      <slot/>
    </label>

    <ul v-if="showFiles" class="upload__list flex">
      <li v-for="(file, index) in files"
          :key="index"
          class="upload__item border rounded-8 flex flex-align-center"
      >
        <div class="upload__info flex flex-column">
          <span class="upload__name text-w500">{{file.name}}</span>
          <span class="upload__size">{{formatSize(file.size)}}</span>
        </div>

        <button class="upload__btn"
                type="button"
                @click="handleDelete(index)"
        >
          Удалить
        </button>
      </li>
    </ul>
  </div>

</template>