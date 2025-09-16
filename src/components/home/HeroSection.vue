<script setup lang="ts">
import FlightSearchBox from './FlightSearchBox.vue'
import topBg from '@/assets/imgs/top-bg.png'
</script>

<template>
  <section class="relative h-[400px] bg-cover bg-center" :style="{ backgroundImage: `url(${topBg})` }">
    <div class="relative top-40 flex items-center justify-center h-full">
      <FlightSearchBox />
    </div>
  </section>
</template>
