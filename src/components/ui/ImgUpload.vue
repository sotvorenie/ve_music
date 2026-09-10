<script setup lang="ts">
import {BASE_URL} from "@api/url.ts";

import {showConfirm} from "@utils/modals.ts";

import Upload from "@ui/Upload.vue";
import Icon from "@ui/Icon.vue";

import EditIcon from "@icons/EditIcon.vue";
import CrossIcon from "@/components/icons/CrossIcon.vue";
import FoxIcon from "@icons/FoxIcon.vue";

const props = withDefaults(
    defineProps<{
      imgUrl: string | undefined | null
      showConfirm?: boolean
      disabled?: boolean
      canDelete?: boolean
    }>(), {
      showConfirm: true,
      disabled: true,
      canDelete: true,
    }
)

const emits = defineEmits<{
  select: [file: File],
  delete: any,
}>()

const handleUpload = async (file: File) => {
  const confirm = props.showConfirm ? await showConfirm(
      'Загрузка фото',
      'Вы действительно хотите загрузить/изменить фото?'
  ) : true
  if (confirm) emits('select', file)
}
</script>

<template>

  <Upload accept=".jpg,.jpeg,.png,.webp"
          :disabled="disabled"
          @select="(files: File[]) => handleUpload(files[0])"
          class="upload-img"
          :class="disabled && 'is-disabled'"
  >
    <div class="upload-img__content img-container position-relative"
         title="Загрузить фото"
    >

      <img v-if="imgUrl"
           :src="`${BASE_URL}${imgUrl}`"
           alt="фото"
      >

      <Icon v-else
            :name="FoxIcon"
            :size="30"
      />

      <Icon :name="EditIcon"
            :size="12"
            recolor
            class="upload-img__icon z-1"
      />

      <button v-if="imgUrl && canDelete"
              class="upload-img__delete flex-center z-10 position-absolute hover-color-accent"
              :disabled="disabled"
              type="button"
              title="Удалить"
              @click.stop="emits('delete')"
      >
        <Icon :name="CrossIcon" :size="6"/>
      </button>
    </div>
  </Upload>

</template>