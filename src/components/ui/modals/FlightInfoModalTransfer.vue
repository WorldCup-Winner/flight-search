<template>
  <div class="my-2 flex justify-center">
    <div class="inline-flex gap-2 bg-tb-body rounded-[10px] px-4 py-2 text-xs text-others-gray1">
      <span>於{{ arrivalCityName || transfer?.transferCity }}轉機</span>
      <span class="text-others-gray1">|</span>
      <span class="text-others-original">{{ toDuration(transfer?.transferStayMinutes ?? 0) }}</span>
      <template v-if="transfer?.isChangeTerminal">
        <span class="text-others-gray1">|</span>
        <span class="text-others-original">不同航廈</span>
      </template>
      <template v-if="isDifferentAirport">
        <span class="text-others-gray1">|</span>
        <span class="text-others-original">不同機場</span>
      </template>
      <template v-if="(baggageStraight ?? 0) > 0">
        <span class="text-others-gray1">|</span>
        <span class="text-others-original">行李直掛</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toDuration } from '@/utils'

const props = defineProps<{
  transfer: {
    transferCity: string
    transferStayMinutes: number
    isCrossday: boolean
    isChangeAirport: boolean
    isChangeTerminal: boolean
  } | null
  arrivalCityName: string
  nextDepartureAirportCode?: string
  currentArrivalAirportCode?: string
  baggageStraight?: number
}>()

const isDifferentAirport = computed(() => {
  return props.currentArrivalAirportCode && 
         props.nextDepartureAirportCode && 
         props.currentArrivalAirportCode !== props.nextDepartureAirportCode
})
</script>

