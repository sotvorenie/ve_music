<script setup lang="ts">
import {ref} from "vue";

import {Search} from "@/types/search.ts";

import {SearchService} from "@api/search/SearchService.ts";

import Icon from "@ui/Icon.vue";

import CrossIcon from "@icons/CrossIcon.vue";

import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();


const searchList = ref<Search[]>([])

const handleSearch = (search: string) => {
  searchStore.searchName = search
}

const deleteSearch = async (id: number) => {
  try {
    await SearchService.delete(id)
  } finally {
    searchList.value = searchList.value.filter(search => search.id !== id)
  }
}

const getSearchHistory = async () => {
  if (searchList.value.length) return

  try {
    const response = await SearchService.getList()
    searchList.value = response.data
  } catch {}
}

await getSearchHistory()
</script>

<template>

  <ul v-auto-animate>
    <li v-for="search in searchList"
        :key="search.id"
    >
      <button class=""
              @click="handleSearch(search.search)"
              type="button"
      >
        <span>{{search.search}}</span>

        <button class=""
                @click.stop="deleteSearch(search.id)">
                type="button"
        >
          <Icon :name="CrossIcon" :size="20"/>
        </button>
      </button>
    </li>
  </ul>

</template>