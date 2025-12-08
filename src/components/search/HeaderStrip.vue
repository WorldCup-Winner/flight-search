<template>
  <div :class="noMargin ? 'bg-none' : 'mb-4 bg-none'">
    <div
      class="relative mb-4 flex rounded-[10px] drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)]"
      :class="[ currentLeg === 'outbound' ? 'bg-primary-gold2' : 'bg-others-gray4' ]"
    >
      <!-- Main leg card -->
      <div 
        class="relative flex-1 py-3 text-white md:py-5 md:pl-48 md:pr-6"
        :class="[
          currentLeg === 'outbound' 
            ? 'pl-4 pr-28' 
            : 'pl-28 pr-4'
        ]"
      >
        <!-- Orange tab: always left on PC, dynamic on mobile -->
        <div 
          class="absolute inset-y-0 w-24 md:w-28 bg-others-original text-white grid place-items-center md:left-0 md:rounded-l-[10px]"
          :class="[
            currentLeg === 'outbound' 
              ? 'right-0 rounded-r-[10px]' 
              : 'left-0 rounded-l-[10px]'
          ]"
        >
          <span class="text-[22px]">{{ segmentTitle }}</span>
        </div>

        <div class="flex flex-col gap-1 md:gap-2">
          <!-- Top row: date, mobile edit button, route (PC keeps date+route on one line) -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <!-- Date (use backend-derived Chinese format; do not synthesize year) -->
            <div class="order-1 text-base md:text-[18px] font-semibold">
              {{ formatDateToChinese(dateText) }}
            </div>

            <!-- Mobile edit button: small capsule with FontAwesome pencil icon (no extra wrapper) -->
            <button
              type="button"
              class="order-2 ml-auto inline-flex items-center gap-1 rounded-md border border-white bg-black/5 px-1.5 py-1 text-[11px] font-medium text-white transition hover:text-others-original md:hidden"
              @click="$emit('edit-segment')"
            >
              <font-awesome-icon icon="pen" class="text-[11px]" />
              <span class="leading-none">修改</span>
            </button>

            <!-- Route: on mobile it wraps to second line; on PC it sits beside the date -->
            <div class="order-3 flex w-full flex-row items-center gap-2 text-sm md:text-[16px] md:order-2 md:w-auto md:gap-3 font-semibold">
              <span>{{ origin.name }}({{ origin.code }})</span>
              <img src="@/assets/imgs/icon-arrow-right-white.svg" class="h-6 w-6 md:w-4 md:h-4" />
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

