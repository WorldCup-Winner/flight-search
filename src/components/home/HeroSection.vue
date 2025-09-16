<script setup lang="ts">
import FlightSearchBox from './FlightSearchBox.vue'
</script>

<template>
  <section
    class="relative h-[400px] bg-cover bg-center"
    style="background-image: url('src/assets/imgs/top-bg.png')"
  >
    <div class="relative flex items-center justify-center h-full">
      <FlightSearchBox />
    </div>
  </section>
</template>
