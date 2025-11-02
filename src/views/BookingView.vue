<template>
  <main class="w-full flex flex-col items-center justify-center bg-[#EFEFEF]">
    <BookingProcessBar :step="step" />
    <StepTwo v-if="step === 2" v-model:step="step" />
    <StepThree v-else-if="step === 3" v-model:step="step"/>
    <StepFour v-else-if="step === 4" v-model:step="step" />
  </main>
</template>
<script setup lang="ts">
import { onUnmounted, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BookingProcessBar from '@/components/booking/BookingProcessBar.vue'
import StepTwo from '@/components/booking/StepTwo.vue'
import StepThree from '@/components/booking/StepThree.vue'
import StepFour from '@/components/booking/StepFour.vue'
import { useBookingStore } from '@/stores/booking'

const route = useRoute()
const router = useRouter()
const step = ref(2)
const bookingStore = useBookingStore()

// Restore booking step from URL or localStorage
onMounted(() => {
  // Try to restore from URL first
  const urlStep = Array.isArray(route.query.step) ? route.query.step[0] : route.query.step
  if (urlStep) {
    const stepNum = parseInt(urlStep)
    if (stepNum >= 2 && stepNum <= 4) {
      step.value = stepNum
    }
  }
  
  // Try to restore booking data from localStorage
  bookingStore.getBookingData()
})

// Update URL when step changes
watch(step, (newStep) => {
  const currentQuery = { ...route.query }
  currentQuery.step = String(newStep)
  router.replace({ query: currentQuery })
})

onUnmounted(() => {
  // Don't clear booking data immediately on unmount - keep it for back navigation
  // bookingStore.clearBookingData()
})

// With options for smooth scrolling
window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
</script>