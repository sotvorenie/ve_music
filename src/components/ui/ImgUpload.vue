<script setup lang="ts">
import {BASE_URL} from "@api/url.ts";

import {showConfirm} from "@utils/modals.ts";

import Upload from "@ui/Upload.vue";
import Icon from "@ui/Icon.vue";

import EditIcon from "@icons/EditIcon.vue";
import CrossIcon from "@/components/icons/CrossIcon.vue";
import FoxIcon from "@icons/FoxIcon.vue";

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

const handleUpload = async (file: File) => {
  const confirm = await showConfirm(
      'Загрузка фото',
      'Вы действительно хотите загрузить/изменить фото?'
  )
  if (confirm) emits('select', file)
}
</script>

<template>

  <Upload :class="[
              'upload-img h-full',
              disabled && 'pointer-events-none'
          ]"
          :disabled="disabled"
          @select="(file: File) => handleUpload(file)"
          accept=".jpg,.jpeg,.png,.webp"
  >
    <div :class="[
              'upload-img__content img-container relative rounded-medium h-full group',
              !imgUrl && '!bg-transparent'
          ]"
         title="Загрузить фото"
    >

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
              class="recolor-svg flex-center transition-opacity opacity-0 z-10 absolute rounded-full top-[1px] right-[1px] group-hover:opacity-100"
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