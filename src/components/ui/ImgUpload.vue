<script setup lang="ts">
import {BASE_URL} from "@api/url.ts";

import {showConfirm} from "@utils/modals.ts";

import Upload from "@ui/Upload.vue";
import Icon from "@ui/Icon.vue";

import EditIcon from "@icons/EditIcon.vue";
import CrossIcon from "@/components/icons/CrossIcon.vue";
import FoxIcon from "@icons/FoxIcon.vue";
import {ref} from "vue";

withDefaults(
    defineProps<{
      imgUrl: string | undefined | null
      disabled?: boolean
      canDelete?: boolean
    }>(), {
      disabled: true,
      canDelete: true,
    }
)

const emits = defineEmits<{
  select: [file: File],
  delete: any,
}>()

const file = ref<File | null>(null)

const handleUpload = async () => {
  if (!file.value) return

  const confirm = await showConfirm(
      'Загрузка фото',
      'Вы действительно хотите загрузить фото?'
  )
  if (confirm) emits('select', file.value)
}
</script>

<template>

  <Upload v-model="file"
          :class="[
              'h-full',
              disabled && 'pointer-events-none'
          ]"
          :disabled="disabled"
          accept=".jpg,.jpeg,.png,.webp,.gif"
          @update:model-value="handleUpload"
  >
    <div :class="[
              'img-container relative rounded-medium h-full group',
              !imgUrl && '!bg-transparent'
          ]"
         title="Загрузить фото"
    >
      <div class="absolute inset-0 bg-[rgba(0,0,0,.4)] transition-opacity opacity-0 hover:opacity-100 duration-300"/>

      <img v-if="imgUrl"
           :src="`${BASE_URL}${imgUrl}?t=${Date.now()}`"
           alt="фото"
      >

      <Icon v-else
            :name="FoxIcon"
            :size="30"
      />

      <Icon :name="EditIcon"
            :size="12"
            recolor
            class="abs-center z-1 transition-opacity opacity-0 group-hover:opacity-100"
      />

      <button v-if="imgUrl && canDelete"
              class="recolor-svg flex-center transition-opacity opacity-0 z-10 absolute rounded-full top-[1px] right-[1px] group-hover:opacity-100 hover:text-accent"
              :disabled="disabled"
              @click.stop="emits('delete')"
              type="button"
              title="Удалить"
      >
        <Icon :name="CrossIcon" :size="6"/>
      </button>
    </div>
  </Upload>

</template>