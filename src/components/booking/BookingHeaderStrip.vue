<template>
  <div :class="noMargin ? 'bg-none' : 'mb-6 bg-none'">
    <div
      class="relative mb-4 flex rounded-[10px] drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)]"
      :class="'bg-primary-gold'"
    >
      <!-- Main leg card -->
      <div 
        class="relative flex-1 py-2 text-white  pl-24 pr-4"
      >
        <!-- Orange tab: always on left -->
        <div 
          class="absolute inset-y-0 w-20 bg-others-original text-white grid place-items-center left-0 rounded-l-[10px]"
        >
          <span class="text-base">{{ segmentTitle }}</span>
        </div>

        <div class="flex flex-col gap-1 md:gap-2">
          <!-- First row: date on left, cabin on right (when showDetailedInfo is true) -->
          <div class="flex items-center gap-2">
            <!-- Date: simple format when showDetailedInfo is false, detailed format when true -->
            <div class="text-sm md:text-[18px] font-semibold">
              <template v-if="showDetailedInfo && departureTime">
                {{ formatDateWithWeekAndTime(dateText, departureTime) }}
              </template>
              <template v-else>
                {{ formatDateToChinese(dateText) }}
              </template>
            </div>

            <!-- Cabin class: on the right of first row when showDetailedInfo is true -->
            <div v-if="showDetailedInfo && cabin" class="text-sm text-white/90 font-semibold">
              {{ cabin }}
            </div>
          </div>

          <!-- Second row: Route -->
          <div class="flex flex-row items-center gap-2 text-xs md:text-[16px] md:gap-3 font-semibold">
            <span>{{ origin.name }}({{ origin.code }})</span>
            <img src="@/assets/imgs/icon-arrow-right-white.svg" class="h-6 w-6 md:w-4 md:h-4" />
            <span>{{ destination.name }}({{ destination.code }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDateToChinese } from '@/utils'

const props = defineProps<{
  currentLeg: 'outbound' | 'return'
  segmentTitle: string
  dateText: string
  origin: { name: string; code: string }
  destination: { name: string; code: string }
  noMargin?: boolean
  showDetailedInfo?: boolean
  departureTime?: string
  cabin?: string
}>()

function formatDateWithWeekAndTime(dateStr: string, timeStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekday = weekdays[date.getDay()]
    
    // Format: "08月26日 (四) 11:55"
    return `${month}月${day}日 (${weekday}) ${timeStr || ''}`
  } catch {
    return ''
  }
}
</script>

