<script setup lang="ts">
defineProps({
  name: String,
  id: String,
  title: String,
  visibleCounter: {
    type: Boolean,
    default: true,
  },
  maxLength: {
    type: Number,
    default: 20,
  },
})

defineOptions({
  inheritAttrs: false
})

const value = defineModel({type: String})
</script>

<template>

  <label class="input position-relative" :for="id">
    <span class="input__name text position-absolute">{{title}}</span>
    <input class="input__inp w-100"
           type="text"
           :name="name"
           :id="id"
           v-model="value"
           v-bind="$attrs"
           :maxlength="maxLength"
    >

    <span v-if="visibleCounter" class="input__counter text position-absolute">
      {{value?.length || 0}} / {{maxLength}}
    </span>

    <span class="input__error text fields_error position-absolute"
          :id="`${id}-error`"
          data-js-form-field-errors
    />
  </label>

</template>