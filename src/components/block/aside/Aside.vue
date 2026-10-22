<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";

import {logout} from "@utils/auth.ts";

import UserRedact from "@components/aside/UserRedact.vue";
import Auth from "@components/aside/Auth.vue";
import UserAvatar from "@components/aside/UserAvatar.vue";

import Tooltip from "@ui/Tooltip.vue";

import MenuIcon from "@icons/MenuIcon.vue";
import CrossIcon from "@icons/CrossIcon.vue";

import useMessageStore from "@store/useMessageStore.ts";
const messageStore = useMessageStore();
import useAudioStore from "@store/useAudioStore.ts";
const audioStore = useAudioStore();

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
  isUserRedact.value = false
  audioStore.activeTrack.isLiked = false
  logout()
  messageStore.show('До новых встреч!!)')
}

const handleKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeAside()
}

onMounted(() => window.addEventListener('keydown', handleKey, true))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKey, true))
</script>

<template>

  <div class="aside">
    <Tooltip class="aside__open !absolute z-10"
             position="bottom-right"
             has-delay
    >
      <template #activator>
        <button class="square-9 3xl:square-10 recolor-svg"
                @click="isOpen = true"
                type="button"
        >
          <MenuIcon/>
        </button>
      </template>

      <template #default>
        Открыть боковое меню
      </template>
    </Tooltip>

    <Transition name="fade">
      <div v-if="isOpen"
           class="absolute z-[1000] inset-0 backdrop-brightness-[0.2] backdrop-blur-[5px] bg-[rgba(0,0,0,.6)]"
           @click="closeAside"
      />
    </Transition>

    <Transition name="aside">
      <div v-if="isOpen"
           class="absolute z-[10000] left-0 top-0 h-full bg-dark-alt p-7.5"
           @click.stop
      >
        <ul class="flex flex-col gap-7.5">
          <li class="square-12.5 flex-center">
            <Tooltip position="right">
              <template #activator>
                <button class="aside__btn square-12.5 recolor-svg rounded-full"
                        :disabled="isUserRedact || isAuth"
                        @click="closeAside"
                        type="button"
                >
                  <CrossIcon/>
                </button>
              </template>

              <template #default>
                Закрыть меню
              </template>
            </Tooltip>
          </li>

          <li class="square-12.5">
            <UserAvatar v-model:is-loading="isLoading"
                        v-model:is-user-redact="isUserRedact"
                        v-model:is-auth="isAuth"
            />
          </li>
        </ul>

        <Transition name="list">
          <UserRedact v-if="isUserRedact"
                      v-model="isLoading"
                      :is-user-redact="isUserRedact"
                      @logout="successLogout"
          />
        </Transition>

        <Transition name="list">
          <Auth v-if="isAuth" @success-auth="successAuth"/>
        </Transition>
      </div>
    </Transition>
  </div>

</template>