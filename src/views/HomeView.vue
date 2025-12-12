<template>
  <main>
    <!-- Hero hides on mobile once search results arrive; remains on desktop -->
    <div :class="sharedValue.isSearch && flightSearchStore.loading === 'success' ? 'hidden md:block' : ''">
      <HeroSection />
    </div>
    <FlightSearchBox />
  </main>
</template>
<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import { useRoute } from 'vue-router'

import HeroSection from '@/components/home/HeroSection.vue'
import FlightSearchBox from '@/components/home/FlightSearchBox.vue'
import { useFlightSearchStore } from '@/stores/flightSearch'
import { hasSearchParams } from '@/utils/urlParamsSync'

const flightSearchStore = useFlightSearchStore()
const route = useRoute()

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

// Reset sharedValue when navigating to home with no search params
watch(
  () => route.path,
  (path) => {
    if (path === '/' && !hasSearchParams(route.query)) {
      sharedValue.value = {
        isOpenBaggageInfoAndFeeRule: false,
        isSearch: false,
        fareRuleData: undefined,
      }
    }
  },
  { immediate: true }
)

// Also watch query changes
watch(
  () => route.query,
  () => {
    if (route.path === '/' && !hasSearchParams(route.query)) {
      sharedValue.value = {
        isOpenBaggageInfoAndFeeRule: false,
        isSearch: false,
        fareRuleData: undefined,
      }
    }
  },
  { deep: true }
)

// With options for smooth scrolling
window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
</script>