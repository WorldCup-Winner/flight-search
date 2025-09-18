<template>
  <!-- Main Flight Search Box-->
  <div class="relative top-52 z-10 flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-2xl p-8 px-14 w-full mx-auto max-w-6xl">
      <div class="flex justify-between w-full">
        <!-- Title -->
        <h1 class="text-h1 font-light text-others-gray1 md:text-h1-d">機票搜尋</h1>

        <!-- Tab Navigation -->
        <div class="flex space-x-2 px-4 py-3 border-2 rounded-xl rounded-b-none border-b-0 border-primary-gold">
          <button @click="activeTab = 'roundtrip'" :class="[
            'px-6 min-w-[148px] min-h-[38px] py-2 rounded-lg font-medium transition',
            activeTab === 'roundtrip' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]">來回</button>
          <button @click="activeTab = 'oneway'" :class="[
            'px-6 py-2 min-w-[148px] min-h-[38px] rounded-lg font-medium transition',
            activeTab === 'oneway' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]">單程</button>
          <button @click="activeTab = 'multi'" :class="[
            'px-6 py-2 min-w-[148px] min-h-[38px] rounded-lg font-medium transition',
            activeTab === 'multi' ? 'bg-primary-gold text-white' : 'bg-others-gray3 text-others-gray1 hover:bg-gray-300'
          ]">多行程</button>
        </div>
      </div>
      <div v-if="activeTab == 'roundtrip'">
        <RoundSearchBox @search="handleRoundSearch" />
      </div>
      <div v-else-if="activeTab === 'oneway'">
        <SingleSearchBox @search="handleSingleSearch" />
      </div>
      <div v-else-if="activeTab === 'multi'">
        <MultiSearchBox @search="handleMultiSearch" />
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

import MultiSearchBox from '@/components/home/MultiSearchBox.vue'
import SingleSearchBox from '@/components/home/SingleSearchBox.vue'
import RoundSearchBox from "@/components/home/RoundSearchBox.vue"

function handleRoundSearch(payload) {
  // console.log('handleRoundSearch:', payload)
}
function handleSingleSearch(payload) {
  // console.log('handleOneWaySearch:', payload)
}

function handleMultiSearch(payload) {
  // console.log('handleMultiSearch:', payload)
  const valid = payload.segments.every(s => s.from && s.to && s.date)
  if (!valid) { alert('請完成每一段的出發地、目的地與日期'); return }

  // Example: navigate with query string (Nuxt 3)
  const q = {
    trip: 'multi',
    adults: payload.passengers.adults,
    children: payload.passengers.children,
    airline: payload.airline,
    cabin: payload.cabinClass,
    direct: payload.direct ? '1' : '0',
    // flatten segments: s0_from, s0_to, s0_date, ...
    ...Object.fromEntries(
      payload.segments.flatMap((s, i) => ([
        [`s${i}_from`, s.from],
        [`s${i}_to`, s.to],
        [`s${i}_date`, s.date],
      ]))
    )
  }
  // navigateTo({ path: '/flights/search', query: q })
}

const activeTab = ref('roundtrip')

/* ----------------- Departure popover state ----------------- */
const isDepartureOpen = ref(false)
const depTriggerRef = ref(null)
const depPopoverRef = ref(null)

/* ----------------- Destination popover state (NEW) ----------------- */
const isDestinationOpen = ref(false)
const destTriggerRef = ref(null)
const destPopoverRef = ref(null)

/* ----------------- Passengers popover state ----------------- */
const isPassengersOpen = ref(false)
const passTriggerRef = ref(null)
const passPopoverRef = ref(null)
const adultCount = ref(1)
const childCount = ref(0)

/* ----------------- Date picker popover state ----------------- */
const isDatePickerOpen = ref(false)
const dateTriggerRef = ref(null)
const datePopoverRef = ref(null)
const startDate = ref(new Date(2025, 9, 12)) // October 12, 2025
const endDate = ref(new Date(2025, 9, 24)) // October 24, 2025

/* ----------------- Airline search popover state ----------------- */
const isAirlineOpen = ref(false)
const airlineTriggerRef = ref(null)
const airlinePopoverRef = ref(null)
const airlineSearchTerm = ref('')

/* ----------------- Cabin class popover state ----------------- */
const isCabinClassOpen = ref(false)
const cabinClassTriggerRef = ref(null)
const cabinClassPopoverRef = ref(null)

/* click outside + ESC to close */
function onDocClick(e) {
  const t = e.target

  // Departure
  if (isDepartureOpen.value) {
    if (
      depPopoverRef.value &&
      !depPopoverRef.value.contains(t) &&
      depTriggerRef.value &&
      !depTriggerRef.value.contains(t)
    ) {
      isDepartureOpen.value = false
    }
  }

  // Destination (NEW)
  if (isDestinationOpen.value) {
    if (
      destPopoverRef.value &&
      !destPopoverRef.value.contains(t) &&
      destTriggerRef.value &&
      !destTriggerRef.value.contains(t)
    ) {
      isDestinationOpen.value = false
    }
  }

  // Passengers
  if (isPassengersOpen.value) {
    if (
      passPopoverRef.value &&
      !passPopoverRef.value.contains(t) &&
      passTriggerRef.value &&
      !passTriggerRef.value.contains(t)
    ) {
      isPassengersOpen.value = false
    }
  }

  // Date picker
  if (isDatePickerOpen.value) {
    if (
      datePopoverRef.value &&
      !datePopoverRef.value.contains(t) &&
      dateTriggerRef.value &&
      !dateTriggerRef.value.contains(t)
    ) {
      isDatePickerOpen.value = false
    }
  }

  // Airline
  if (isAirlineOpen.value) {
    if (
      airlinePopoverRef.value &&
      !airlinePopoverRef.value.contains(t) &&
      airlineTriggerRef.value &&
      !airlineTriggerRef.value.contains(t)
    ) {
      isAirlineOpen.value = false
    }
  }

  // Cabin class
  if (isCabinClassOpen.value) {
    if (
      cabinClassPopoverRef.value &&
      !cabinClassPopoverRef.value.contains(t) &&
      cabinClassTriggerRef.value &&
      !cabinClassTriggerRef.value.contains(t)
    ) {
      isCabinClassOpen.value = false
    }
  }
}
function onKey(e) {
  if (e.key === 'Escape') {
    isDepartureOpen.value = false
    isDestinationOpen.value = false
    isPassengersOpen.value = false
    isDatePickerOpen.value = false
    isAirlineOpen.value = false
    isCabinClassOpen.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
/* subtle entrance for the small modal */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all .15s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
