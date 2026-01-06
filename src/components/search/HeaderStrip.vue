<template>
  <div :class="[noMargin ? 'h-full' : 'mb-4']">
    <div
      class="relative flex drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] h-full overflow-hidden"
      :class="[
        attachLeft ? 'rounded-l-[10px]' : 'rounded-[10px]',
        currentLeg === 'outbound' ? 'bg-primary-gold' : 'bg-others-gray11'
      ]"
    >
      <!-- Desktop: Left vertical orange section -->
      <div 
        class="hidden md:absolute md:inset-y-0 md:w-28 md:bg-others-original md:text-white md:grid md:place-items-center md:left-0 md:rounded-l-[10px]"
      >
        <span class="text-[22px]">{{ segmentTitle }}</span>
      </div>

      <!-- Mobile: Left orange section with vertical text (always on left) -->
      <div 
        class="md:hidden w-12 bg-others-original text-white flex items-center justify-center rounded-l-[10px] shrink-0"
      >
        <span class="text-lg font-semibold" style="writing-mode: vertical-rl; text-orientation: upright; letter-spacing: 0.15em;">{{ segmentTitle }}</span>
      </div>

      <!-- Main content area -->
      <div 
        class="relative flex-1 py-3 text-white md:py-5 md:pl-48 md:pr-6"
        :class="[
          'md:pl-48',
          'pl-3 pr-3',
          'md:bg-transparent',
          currentLeg === 'outbound' ? 'bg-primary-gold' : 'bg-others-gray11'
        ]"
      >
        <div class="flex flex-col gap-1 md:gap-x-4 h-full relative">
          <!-- Mobile: Date row with edit button in top right -->
           <div class="flex flex-col md:flex-row items-start gap-3 md:gap-4 w-full">
            <div class="flex items-center justify-between md:flex-wrap md:gap-x-4 md:gap-y-2 w-full md:w-auto">
              <!-- Date -->
              <div class="text-[11px] md:text-[18px] font-semibold">
                <span>{{ formatChineseDateToYYYYMMDD(new Date(dateText)) }}</span>
              </div>

              <!-- Mobile edit button (top right corner) with border -->
              <button
                type="button"
                class="md:hidden shrink-0 inline-flex items-center gap-0.5 rounded-md border border-white bg-black/5 px-1.5 py-1 text-xs font-medium text-white transition hover:text-others-original"
                @click="$emit('edit-segment')"
                aria-label="編輯"
              >
                <font-awesome-icon icon="pen" class="w-2.5 h-2.5" />
              </button>
            </div>

            <!-- Route: second line on mobile, same row on desktop -->
            <div class="flex flex-row items-center text-[10px] md:text-[16px] gap-1.5 md:gap-5 font-semibold">
              <span>{{ origin.name }}({{ origin.code }})</span>
              <img src="@/assets/imgs/icon-arrow-right-white.svg" class="w-4 h-4" />
              <span>{{ destination.name }}({{ destination.code }})</span>
            </div>
           </div>

          <!-- Total count / helper text: desktop & tablet only -->
          <div class="hidden text-[13px] text-others-gray7 md:block md:text-[15px]">
            共找到 <span class="font-bold">{{ totalCount }}</span> 筆航班 以下皆為當地時間（24小時制），價格為每人均價(含稅及附加費)。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDateToChinese, formatChineseDateToYYYYMMDD } from '@/utils'

defineProps<{
  currentLeg: 'outbound' | 'return'
  segmentTitle: string
  dateText: string
  origin: { name: string; code: string }
  destination: { name: string; code: string }
  totalCount: number
  noMargin?: boolean
  attachLeft?: boolean
}>()

defineEmits<{
  (e: 'edit-segment'): void
}>()
</script>

