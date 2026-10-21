<script setup lang="ts">
const props = withDefaults(
    defineProps<{
      disabled: boolean
      accept?: string
    }>(), {
      disabled: true,
    }
)

const emits = defineEmits<{
  select: [file: File]
}>()

const onChange = (e: Event) => {
  if (props.disabled) return

  const target = e.target as HTMLInputElement
  const files = target?.files || []
  if (target?.files) emits('select', files[files.length - 1])
}
</script>

<template>

  <div class="flex flex-col gap-2.5">
    <label class="cursor-pointer h-full"
    >
      <input :accept="accept"
             :disabled="disabled"
             hidden
             @change="onChange"
             type="file"
      >
      <slot/>
    </label>
  </div>

</template>