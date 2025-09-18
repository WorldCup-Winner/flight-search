<script setup lang="ts">
import topBg from '@/assets/imgs/top-bg.png'
</script>

<template>
  <div class="absolute inset-0 w-full h-[400px] bg-cover bg-center bg-no-repeat"
    :style="{ backgroundImage: `url(${topBg})` }">
    <!-- Optional overlay for better text readability -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
  </div>
</template>
