<template>
  <div :class="noMargin ? 'bg-none' : 'mb-4 bg-none'">
    <div
      class="relative flex rounded-[10px] drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] h-full"
      :class="[
        noMargin ? '' : 'mb-4',
        currentLeg === 'outbound' ? 'bg-primary-gold2' : 'bg-others-gray4'
      ]"
    >
      <!-- Main leg card -->
      <div 
        class="relative flex-1 py-3 text-white md:py-5 md:pl-48 md:pr-6"
        :class="[
          currentLeg === 'outbound' 
            ? 'pl-4 pr-24' 
            : 'pl-24 pr-4'
        ]"
      >
        <!-- Orange tab: always left on PC, dynamic on mobile -->
        <div 
          class="absolute inset-y-0 w-20 md:w-28 bg-others-original text-white grid place-items-center md:left-0 md:rounded-l-[10px]"
          :class="[
            currentLeg === 'outbound' 
              ? 'right-0 rounded-r-[10px]' 
              : 'left-0 rounded-l-[10px]'
          ]"
        >
          <span class="text-xl md:text-[22px]">{{ segmentTitle }}</span>
        </div>

        <div class="flex flex-col gap-1 md:gap-2">
          <!-- Top row: date, mobile edit button, route (PC keeps date+route on one line) -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <!-- Date + Edit (ALWAYS same row on mobile) -->
            <div class="order-1 flex w-full md:w-auto items-center gap-2 min-w-0 flex-nowrap">
              <!-- Date (truncate so edit button never drops) -->
              <div class="text-xs md:text-[18px] font-semibold truncate min-w-0">
                {{ formatDateToChinese(dateText) }}
              </div>

              <!-- Mobile edit button -->
              <button
                type="button"
                class="ml-auto shrink-0 inline-flex items-center gap-0.5 rounded-md border border-white bg-black/5 px-1.5 py-1 text-xs font-medium text-white transition hover:text-others-original md:hidden"
                @click="$emit('edit-segment')"
              >
                <font-awesome-icon icon="pen" />
                <span class="leading-none">修改</span>
              </button>
            </div>

            <!-- Route: on mobile it wraps to second line; on PC it sits beside the date -->
            <div class="order-3 flex w-full flex-row items-center text-xs md:text-[16px] md:order-2 md:w-auto gap-1.5 md:gap-3 font-semibold">
              <span>{{ origin.name }}({{ origin.code }})</span>
              <img src="@/assets/imgs/icon-arrow-right-white.svg" class="w-6 h-6 md:w-4 md:h-4" />
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
import { formatDateToChinese } from '@/utils'

defineProps<{
  currentLeg: 'outbound' | 'return'
  segmentTitle: string
  dateText: string
  origin: { name: string; code: string }
  destination: { name: string; code: string }
  totalCount: number
  noMargin?: boolean
}>()

defineEmits<{
  (e: 'edit-segment'): void
}>()
</script>

