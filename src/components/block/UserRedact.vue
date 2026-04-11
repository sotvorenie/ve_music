<script setup lang="ts">
import {computed, onMounted, ref} from "vue";

import InputUi from "../ui/InputUi.vue";
import ButtonUi from "../ui/ButtonUi.vue";

import useUserStore from "../../store/useUserStore.ts";
import {showConfirm} from "../../utils/modals.ts";
const userStore = useUserStore();

defineProps({
  isUserRedact: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['logout'])

const nameCopy = ref<string>('')

// активность кнопки "Редактировать"
const redactIsActive = computed(() => {
  return nameCopy.value !== userStore.user.name
})

// клик по кнопке "Выйти"
const handleLogout = async () => {
  const check = await showConfirm(
      'Выход из профиля',
      'Вы действительно хотите выйти?'
  )
  if (check) emits('logout')
}

onMounted(() => {
  nameCopy.value = userStore.user.name
})
</script>

<template>
  <div class="user-redact aside__block flex flex-column flex-between position-absolute z-1000" v-if="isUserRedact">
    <InputUi v-model="nameCopy"
             class="user-redact__name w-100"
             title="Имя"
    />

    <div class="user-redact__btn-bar flex">
      <ButtonUi :is-disabled="!redactIsActive || !nameCopy.length" :is-loading="isLoading">
        Редактировать
      </ButtonUi>
      <ButtonUi @click="handleLogout"
                :is-loading="isLoading"
      >
        Выйти
      </ButtonUi>
    </div>
  </div>
</template>