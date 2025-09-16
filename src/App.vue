<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<template>
  <Header />

  <RouterView />

  <Footer />
</template>

<style scoped lang="scss"></style>
