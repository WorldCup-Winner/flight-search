<template>
  <main>
    <!-- Hero hides on mobile once a search has been performed; remains on desktop -->
    <div :class="sharedValue.isSearch ? 'hidden md:block' : ''">
      <HeroSection />
    </div>
    <FlightSearchBox />
  </main>
</template>
<script setup lang="ts">
import { ref, provide } from 'vue'

import HeroSection from '@/components/home/HeroSection.vue'
import FlightSearchBox from '@/components/home/FlightSearchBox.vue'

interface SharedData {
  isOpenBaggageInfoAndFeeRule: boolean,
  isSearch: boolean,
  fareRuleData?: any, // Store the fare rule data to pass to the dialog
}

const sharedValue = ref<SharedData>({
  isOpenBaggageInfoAndFeeRule: false,
  isSearch: false,
  fareRuleData: undefined,
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