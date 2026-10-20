<script setup lang="ts">
withDefaults(
    defineProps<{
      title: string
      visibleCounter?: boolean
      maxLength?: number
    }>(), {
      visibleCounter: true,
      maxLength: 20,
    }
)

defineOptions({
  inheritAttrs: false
})

const value = defineModel<string>()
</script>

<template>

  <label class="input relative block">
    <span class="absolute text-[0.9em] bg-dark-15 leading-none -top-2 left-2.5 px-1">
      {{title}}
    </span>

    <input class="w-full bg-dark-15 rounded-regular border border-current p-2.5 focus:border-accent hover:border-accent"
           v-model="value"
           v-bind="$attrs"
           :maxlength="maxLength"
    >

    <span v-if="visibleCounter"
          class="absolute text-[0.9em] bg-dark-15 leading-none -bottom-2 right-2.5 px-1.5"
    >
      {{value?.length || 0}} / {{maxLength}}
    </span>

    <span class="fields_error absolute text-[0.9em] bg-dark-15 leading-none top-[calc(100%_+_0.31rem)] left-1 text-accent"
          data-js-form-field-errors
    />
  </label>

</template>