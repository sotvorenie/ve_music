<script setup lang="ts">
import {computed, ref} from "vue";

import {logout} from "../../utils/auth.ts";

import UserRedact from "./UserRedact.vue";
import Auth from "./Auth.vue";
import TopMessage from "../ui/TopMessage.vue";

import MenuIcon from "../../assets/icons/MenuIcon.vue";
import CrossIcon from "../../assets/icons/CrossIcon.vue";
import FoxIcon from "../../assets/icons/FoxIcon.vue";

import useUserStore from "../../store/useUserStore.ts";
const userStore = useUserStore();

const isOpen = ref<boolean>(false)

const isUserRedact = ref<boolean>(false)
const isAuth = ref<boolean>(false)

const message = ref('')
const messageVisible = ref<boolean>(false)

const closeAside = () => {
  if (isUserRedact.value || isAuth.value) return

  isUserRedact.value = false
  isOpen.value = false
}

// title у блока аватарки перед открытием
const avatarTitle = computed(() => {
  if (!isUserRedact.value && !isAuth.value) {
    if (userStore.user.id >= 0) {
      return 'Редактировать профиль'
    } else {
      return 'Войти/Зарегистрироваться'
    }
  } else {
    return ''
  }
})

// клик по аватарке
const handleAvatar = () => {
  if (userStore.user.id >= 0) {
    isUserRedact.value = !isUserRedact.value
  } else {
    isAuth.value = !isAuth.value
  }
}

const successAuth = (messageText: string) => {
  isAuth.value = false
  message.value = messageText
  messageVisible.value = true
}

const successLogout = () => {
  isUserRedact.value = false
  logout()
  message.value = 'До новых встреч!!)'
  messageVisible.value = true
}
</script>

<template>

  <TopMessage :message="message" v-model="messageVisible"/>

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
          <button class="aside__btn recolor-svg hover-color-accent"
                  type="button"
                  @click="closeAside"
                  :disabled="isUserRedact || isAuth"
          >
            <CrossIcon/>
          </button>
        </li>
        <li class="aside__item">
          <div class="aside__avatar aside__btn position-relative cursor-pointer"
               :class="{'is-active': isUserRedact}"
               @click="handleAvatar"
          >
            <div class="border position-absolute z-10000"></div>
            <div class="img-container position-absolute z-10000"
                 :title="avatarTitle"
            >
              <FoxIcon v-if="!userStore.user?.avatar_url"/>
              <img v-else :src="userStore.user.avatar_url" :alt="userStore.user.name"/>
            </div>
          </div>
        </li>
      </ul>

      <Transition name="list">
        <UserRedact v-if="isUserRedact"
                    :is-user-redact="isUserRedact"
                    @logout="successLogout"
        />
      </Transition>

      <Transition name="list">
        <Auth v-if="isAuth" @success-auth="successAuth"/>
      </Transition>
    </div>
  </Transition>

</template>