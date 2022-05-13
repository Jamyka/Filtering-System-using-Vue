<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <NavBar />
  <RouterView />
  <Footer />
</template>

<style>
#app {
  /* max-width: 1280px;
  margin: 0 auto; */
  /* padding: 2rem; */
  /* display: flex;
  justify-content: center;
  align-items: center; */
  overflow-x: hidden;
  font-weight: normal;
}
</style>
