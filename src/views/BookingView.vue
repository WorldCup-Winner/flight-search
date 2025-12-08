<template>
  <main class="w-full flex flex-col items-center justify-center bg-[#EFEFEF]">
    <div class = "hidden md:block">
      <BookingProcessBar :step="step"/>
    </div>
    <StepTwo v-if="step === 2" v-model:step="step" />
    <StepThree v-else-if="step === 3" v-model:step="step"/>
    <StepFour v-else-if="step === 4" v-model:step="step" />
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useBookingStore } from '@/stores/booking'

import BookingProcessBar from '@/components/booking/BookingProcessBar.vue'
import StepTwo from '@/components/booking/StepTwo.vue'
import StepThree from '@/components/booking/StepThree.vue'
import StepFour from '@/components/booking/StepFour.vue'

const bookingStore = useBookingStore()

const getStoredStep = (): number => {
  if (!bookingStore.segments || bookingStore.segments.length === 0) {
    return 2
  }
  
  const stored = sessionStorage.getItem('bookingStep')
  if (stored) {
    const stepNum = parseInt(stored, 10)
    if (stepNum >= 2 && stepNum <= 4) {
      return stepNum
    }
  }
  return 2
}

const step = ref(getStoredStep())

watch(step, (newStep) => {
  sessionStorage.setItem('bookingStep', String(newStep))
})

// With options for smooth scrolling
onMounted(() => {
  // Reset to step 2 if there's no valid booking data
  if (!bookingStore.segments || bookingStore.segments.length === 0) {
    step.value = 2
    sessionStorage.setItem('bookingStep', '2')
  }
  
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
})
</script>