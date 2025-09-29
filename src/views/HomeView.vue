<template>
  <main class="">
    <HeroSection />
    <FlightSearchBox />
  </main>
</template>
<script setup lang="ts">
import { ref, provide } from 'vue'

import HeroSection from '@/components/home/HeroSection.vue'
import FlightSearchBox from '@/components/home/FlightSearchBox.vue'

interface SharedData {
  isOpenBaggageInfoAndFeeRule: boolean,
  isSearch: boolean
}

const sharedValue = ref<SharedData>({
  isOpenBaggageInfoAndFeeRule: false,
  isSearch: false,
})

function updateValue(val: SharedData) {
  sharedValue.value = val
}

provide('sharedValue', sharedValue)
provide<(val: SharedData) => void>('updateValue', updateValue)

// With options for smooth scrolling
window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
</script>