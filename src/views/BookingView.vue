<template>
  <main class="w-full flex flex-col items-center justify-center bg-[#EFEFEF]">
    <div class="hidden md:block">
      <BookingProcessBar :step="currentStep" />
    </div>
    <!-- Route components render here -->
    <router-view />
  </main>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import BookingProcessBar from '@/components/booking/BookingProcessBar.vue'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

// Derive current step from route name
const currentStep = computed(() => {
  const routeName = route.name as string
  if (routeName === 'booking-step-2') return 2
  if (routeName === 'booking-step-3') return 3
  if (routeName === 'booking-step-4') return 4
  return 2 // Default
})

// Validate booking data on mount
onMounted(() => {
  // CRITICAL: Restore booking data from localStorage FIRST (before any validation)
  // This must happen in BookingView (parent) so it works for all steps (2, 3, 4)
  // If we only call it in StepTwo, refreshing on step 3/4 will lose data
  bookingStore.getBookingData()
  
  // If no booking segments after restoration, redirect to home (user shouldn't be on booking page)
  if (!bookingStore.segments || bookingStore.segments.length === 0) {
    // No booking data - user shouldn't be here, redirect to home
    router.push({ name: 'home' })
    return
  }
  
  // If on /booking (without step), redirect to step-2
  if (route.name === 'booking') {
    router.replace({ name: 'booking-step-2' })
    return
  }
  
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
})
</script>