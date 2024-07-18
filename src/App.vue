<script setup>
import Header from "@layouts/Header.vue";
import Footer from "@layouts/Footer.vue";
</script>

<template>
  <div class="bg-white">
    <Header></Header>
    <main class="container mt-16  pb-16">
      <router-view></router-view>
    </main>
    <Footer class="bg-black px-16"></Footer>
  </div>
</template>

<style>
@import url("@assets/scss/main.scss");
</style>
