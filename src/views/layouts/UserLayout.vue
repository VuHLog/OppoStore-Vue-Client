<script setup>
import SideNav from "@layouts/User/SideNav.vue";
</script>

<template>
  <div class="d-flex" style="min-height: 100vh;">
      <side-nav class="col-3"></side-nav>
      <div class="col-9">
        <div class="h-100">
            <router-view></router-view>
        </div>
      </div>
  </div>
</template>

<style lang="scss" scoped>
</style>