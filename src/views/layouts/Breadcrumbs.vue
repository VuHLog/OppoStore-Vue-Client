<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  currentPage: {
    type: String,
    required: true,
  },
  previusPage: {
    type: Array,
    required: false,
  },
});
</script>
<template>
  <nav
    class="d-flex align-center px-3 py-2 text-gray-700 border-w-sm rounded-lg bg-181818 truncate"
  >
    <ol class="d-flex flex-wrap align-center m-0 p-0">
      <li class="inline-flex align-center mr-2">
        <router-link
          to="/home"
          class="hover d-flex align-center text-decoration-none text-sm font-medium text-zinc-400 whitespace-wrap"
        >
          <font-awesome-icon class="mr-2" :icon="['fas', 'house']" />
          <span>Iflix</span>
        </router-link>
      </li>

      <template v-for="page in previusPage">
        <li class="inline-flex align-center mr-2">
          <router-link
            :to="page.link"
            class="hover d-flex align-center text-decoration-none text-sm font-medium text-zinc-400 whitespace-wrap"
          >
            <font-awesome-icon class="mr-2" :icon="['fas', 'chevron-right']" />
            <span>{{ page.name }}</span>
          </router-link>
        </li>
      </template>

      <li class="inline-flex align-center mr-2">
        <div
          class="d-flex align-center text-decoration-none text-sm font-medium text-gray-200 whitespace-wrap"
        >
          <font-awesome-icon class="mr-2" :icon="['fas', 'chevron-right']" />
          <span>{{ props.currentPage }}</span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<style lang="scss" scoped>
@import url("@assets/scss/breadcrumbs.scss");
</style>