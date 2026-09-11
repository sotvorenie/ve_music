<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";

import {logout} from "@utils/auth.ts";

import UserRedact from "@components/UserRedact.vue";
import Auth from "@components/Auth.vue";
import UserAvatar from "@components/UserAvatar.vue";

import Tooltip from "@ui/Tooltip.vue";

import MenuIcon from "@/components/icons/MenuIcon.vue";
import CrossIcon from "@/components/icons/CrossIcon.vue";

import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();

const isOpen = ref<boolean>(false)

const isUserRedact = ref<boolean>(false)
const isAuth = ref<boolean>(false)

const isLoading = ref<boolean>(false)

const closeAside = () => {
  if (isLoading.value) return

  if (isUserRedact.value || isAuth.value) {
    isUserRedact.value = false
    isAuth.value = false
  } else {
    isOpen.value = false
  }
}

const successAuth = (messageText: string) => {
  isAuth.value = false
  messageStore.show(messageText)
}

const successLogout = () => {
  logout()
  messageStore.show('До новых встреч!!)')
}

const handleKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeAside()
}

onMounted(() => window.addEventListener('keydown', handleKey))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKey))
</script>

<template>

  <button class="aside__open recolor-svg position-absolute hover-color-accent z-10"
          type="button"
          title="Открыть боковое меню"
          @click="isOpen = true"
  >
    <MenuIcon/>
  </button>

  <Transition name="fade">
    <div class="aside__background position-absolute z-1000"
         v-if="isOpen"
         @click="closeAside"
    />
  </Transition>

  <Transition name="aside">
    <div class="aside__content position-absolute z-10000"
         @click.stop
         v-if="isOpen"
    >
      <ul class="aside__list flex flex-column">
        <li class="aside__item">
          <Tooltip position="right">
            <template #activator>
              <button class="aside__btn recolor-svg hover-color-accent"
                      type="button"
                      @click="closeAside"
                      :disabled="isUserRedact || isAuth"
              >
                <CrossIcon/>
              </button>
            </template>
            <template #default>Закрыть меню</template>
          </Tooltip>
        </li>
        <li class="aside__item">
          <UserAvatar v-model:is-loading="isLoading"
                      v-model:is-user-redact="isUserRedact"
                      v-model:is-auth="isAuth"
          />
        </li>
      </ul>

      <Transition name="list">
        <UserRedact v-if="isUserRedact"
                    :is-user-redact="isUserRedact"
                    v-model="isLoading"
                    @logout="successLogout"
        />
      </Transition>

      <Transition name="list">
        <Auth v-if="isAuth" @success-auth="successAuth"/>
      </Transition>
    </div>
  </Transition>

</template>