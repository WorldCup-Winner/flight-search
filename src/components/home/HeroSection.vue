<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'
import topBg from '@/assets/imgs/top-bg.png'
import topBgMobile from '@/assets/imgs/top-bg-mobile.png'

const sharedValue = inject<Ref<{ isOpenBaggageInfoAndFeeRule: boolean; isSearch: boolean }>>('sharedValue')

const heroHeightClass = computed(() => {
  const isSearch = sharedValue?.value?.isSearch
  return isSearch ? 'h-[320px] md:h-[300px]' : 'h-[420px] md:h-[500px]'
})
</script>

<template>
  <div class="absolute inset-x-0 top-0 w-full pointer-events-none">
    <div class="relative w-full overflow-hidden">
      <picture>
        <source media="(min-width: 768px)" :srcset="topBg" />
        <img
          :src="topBgMobile"
          alt="Galilee Tours hero"
          class="w-full object-cover"
          :class="heroHeightClass"
        />
      </picture>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
    </div>
  </div>
</template>
