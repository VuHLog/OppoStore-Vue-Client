<script setup>
import Header from "@layouts/Header.vue";
import Footer from "@layouts/Footer.vue";
</script>

<template>
  <div class="bg-white" style="min-height: 100vh;">
    <Header></Header>
    <main class="container mt-16 pb-16" style="min-height: 80vh;">
      <router-view></router-view>
    </main>
    <Footer></Footer>
  </div>
</template>

<style>
@import url("@assets/scss/main.scss");
</style>
