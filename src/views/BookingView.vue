<template>
  <main class="w-full flex flex-col items-center justify-center bg-[#EFEFEF]">
    <BookingProcessBar :step="step" />
    <StepTwo v-if="step === 2" v-model:step="step" />
    <StepThree v-else-if="step === 3" v-model:step="step"/>
    <StepFour v-else-if="step === 4" v-model:step="step" />
  </main>
</template>
<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

import BookingProcessBar from '@/components/booking/BookingProcessBar.vue'
import StepTwo from '@/components/booking/StepTwo.vue'
import StepThree from '@/components/booking/StepThree.vue'
import StepFour from '@/components/booking/StepFour.vue'
import { useAuthStore } from '@/stores/auth'

const step = ref(2)
const authStore = useAuthStore()

onUnmounted(() => {
  authStore.removeBookingData() 
})

// With options for smooth scrolling
window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
</script>