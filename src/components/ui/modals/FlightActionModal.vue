<template>
  <transition name="slide-up">
    <div
      v-if="open"
      class="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white/95 backdrop-blur-sm rounded-tl-[24px] rounded-tr-[24px] shadow-[0px_-2px_30px_rgba(0,0,0,0.1)]"
    >
      <!-- Footer with Price and Buttons -->
      <div class="bg-white px-6 py-4 flex-shrink-0  rounded-tl-[24px] rounded-tr-[24px]">
        <div class="flex items-center justify-between gap-4">
          <!-- Price on Left -->
          <div class="flex-shrink-0">
            <div class="flex items-end font-bold whitespace-nowrap">
              <div class="text-[12px] text-others-original">{{ currencyDisplay }}</div>
              <div class="text-[28px] text-others-original leading-none">{{ formatPrice(priceTotal) }}</div>
            </div>
            <div v-if="taxMode === 'in'" class="text-[12px] pt-1 text-others-gray1">
              <span class="font-bold text-[14px]">每人均價</span>(含稅及附加費)
            </div>
            <div v-else class="text-[12px] pt-1 text-others-gray1">
              參考稅費&nbsp;{{ currencyDisplay }}&nbsp;{{ formatPrice(taxAmount ?? 0) }}
            </div>
          </div>

          <!-- Buttons on Right -->
          <div class="flex gap-3 flex-shrink-0">
            <button
              type="button"
              class="px-4 py-3 rounded-[15px] text-white bg-primary-gold font-bold hover:bg-others-gray5 transition whitespace-nowrap"
              @click="handleFlightInfo"
            >
              航班資訊
            </button>
            <button
              type="button"
              class="px-4 py-3 rounded-[15px] text-white bg-others-original font-bold hover:bg-others-hover transition whitespace-nowrap"
              @click="handleNextStep"
            >
              {{ isLastStep ? '訂購' : '下一步' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { formatPrice } from '@/utils'

const props = defineProps<{
  open: boolean
  priceTotal: number
  currencyDisplay: string
  taxMode: 'in' | 'ex'
  taxAmount?: number
  isLastStep?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'flight-info'): void
  (e: 'next-step'): void
}>()

function handleFlightInfo() {
  emit('flight-info')
}

function handleNextStep() {
  emit('next-step')
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-leave-to {
  transform: translateY(100%);
}
</style>

