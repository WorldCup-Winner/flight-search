<template>
  <div class="rounded-[10px] p-2">
    <!-- Left: Date and Times with vertical line -->
    <div class="flex gap-3 mb-4">
      <!-- Left column: Dates and Times -->
      <div class="flex flex-col justify-between min-w-[100px]">
        <div class="flex items-center gap-2 mb-2">
          <div class="text-others-gray1 text-sm">{{ formatDateToChinese(sector.departureDate) }}</div>
          <div class="font-bold text-others-gray7">{{ sector.departureTime }}</div>
        </div>
        <div class="text-others-gray1 text-sm flex justify-center mb-2">{{ toDuration(sector.durationMinutes) }}</div>
        <div class="flex items-center gap-2">
          <div class="text-others-gray1 text-sm">{{ formatDateToChinese(sector.arrivalDate) }}</div>
          <div class="font-bold  text-others-gray7 relative">
            {{ sector.arrivalTime }}
            <span v-if="sector.crossDays && sector.crossDays > 0" class="absolute -top-1 -right-4 text-[10px] text-others-original font-normal">+{{ sector.crossDays }}</span>
          </div>
        </div>
      </div>

      <!-- Vertical line with dots -->
      <div class="relative flex-shrink-0" style="width: 3px;">
        <span class="absolute -left-[6px] top-0 w-[14px] h-[14px] rounded-full bg-gray-300"></span>
        <div class="w-[3px] h-full bg-gray-300 "></div>
        <span class="absolute -left-[6px] bottom-0 w-[14px] h-[14px] rounded-full bg-gray-300"></span>
      </div>

      <!-- Right: Airport and Flight Info -->
      <div class="flex-1 space-y-4 text-xs">
        <!-- Departure Airport -->
        <div class="font-bold text-others-gray7">
          {{ sector.departureAirportCode }} {{ sector.departureAirportName }} {{ sector.departureTerminal }} {{ sector.departureCityName }}
        </div>

        <!-- Airline and Flight Info -->
        <div class="flex items-center gap-1 text-others-gray1">
          <img
            v-if="airlineLogoFor(sector)"
            :src="airlineLogoFor(sector)"
            :alt="sector.marketingAirlineName || sector.operatingAirlineName"
            class="w-5 h-5 object-contain"
            @error="onImageError"
          />
          <span class="font-semibold">{{ sector.flightNo || sector.operatingFlightNo }}</span>
          <span>{{ sector.marketingAirlineName || sector.operatingAirlineName }}</span>
          <span v-if="sector.craft?.craftName">{{ sector.craft.craftName }}</span>
        </div>

        <!-- Arrival Airport -->
        <div class="font-bold text-others-gray7">
          {{ sector.arrivalAirportCode }} {{ sector.arrivalAirportName }} {{ sector.arrivalTerminal }} {{ sector.arrivalCityName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDateToChinese, toDuration } from '@/utils'
import type { Sector } from '@/utils/types'
import AirlineDefault from '@/assets/imgs/airlines/airline-default.svg'

const props = defineProps<{
  sector: Sector
  airlineLogoFor: (sec: Sector) => string | undefined
}>()

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = AirlineDefault
}
</script>

