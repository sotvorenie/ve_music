<script setup lang="ts">
import {ref} from "vue";

import {Search} from "@/types/search.ts";

import {isCanceledErr} from "@/api";
import {SearchService} from "@api/search/SearchService.ts";

import {useAbortableRequest} from "@composables/useAbortableRequest.ts";

import Icon from "@ui/Icon.vue";

import CrossIcon from "@icons/CrossIcon.vue";

import useSearchStore from "@store/useSearchStore.ts";
const searchStore = useSearchStore();

const {nextSignal, isCurrent} = useAbortableRequest()

const searchList = ref<Search[]>([])

const handleSearch = (search: string) => {
  searchStore.searchName = search
}

const deleteSearch = async (id: number) => {
  const signal = nextSignal()

  try {
    await SearchService.delete(id, signal)
  } catch (err:unknown) {
    if (isCanceledErr(err)) return
  } finally {
    if (isCurrent(signal)) {
      searchList.value = searchList.value.filter(search => search.id !== id)
    }
  }
}

const getSearchHistory = async () => {
  if (searchList.value.length) return

  const signal = nextSignal()

  try {
    const response = await SearchService.getList(signal)
    searchList.value = response.data
  } catch (err:unknown) {
    if (isCanceledErr(err)) return
  }
}

await getSearchHistory()
</script>

<template>

  <ul v-auto-animate>
    <li v-for="search in searchList"
        :key="search.id"
    >
      <div @click="handleSearch(search.search)">
        <span>{{search.search}}</span>

        <button class=""
                @click.stop="deleteSearch(search.id)">
                type="button"
        >
          <Icon :name="CrossIcon" :size="20"/>
        </button>
      </div>
    </li>
  </ul>

</template>