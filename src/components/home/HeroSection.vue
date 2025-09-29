<script setup lang="ts">
import { inject } from 'vue'
import topBg from '@/assets/imgs/top-bg.png'

const sharedValue = inject<{ isOpenBaggageInfoAndFeeRule: boolean; isSearch: boolean }>('sharedValue')
</script>

<template>
  <div
    class="absolute inset-0 w-full bg-cover bg-no-repeat"
    :class="[sharedValue?.isSearch ? 'h-[300px]' : 'h-[500px]']"
    :style="{ backgroundImage: `url(${topBg})` }">
    <!-- Optional overlay for better text readability -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
  </div>
</template>
