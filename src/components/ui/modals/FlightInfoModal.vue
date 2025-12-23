<template>
  <Teleport to="body">
    <transition name="fade-scale">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] bg-black/40 flex items-end md:hidden"
        @click.self="$emit('close')"
      >
        <div class="flex flex-col w-full bg-white rounded-t-3xl max-h-[90vh] overflow-hidden" @click.stop>
          <!-- Modal Header -->
          <div class="bg-primary-gold text-white p-3 text-[18px] font-semibold flex items-center justify-between flex-shrink-0 z-20 rounded-t-3xl">
            <span>航班資訊</span>
            <button
              class="text-white hover:opacity-80 transition"
              @click="$emit('close')"
              aria-label="關閉"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Flight Information Content -->
          <div class="flex-1 overflow-y-auto min-h-0 p-3">

            <div>
              <div v-for="(sec, i) in sectors" :key="`current-${i}`" class="mb-4">
                <FlightSectorDetail :sector="sec" :airline-logo-for="airlineLogoFor" />
                <TransferInfo
                  v-if="i < sectors.length - 1 && sec.transfer"
                  :transfer="sec.transfer"
                  :arrival-city-name="sec.arrivalCityName"
                  :next-departure-airport-code="sectors[i + 1]?.departureAirportCode"
                  :current-arrival-airport-code="sec.arrivalAirportCode"
                  :baggage-straight="sec.baggageStraight"
                />
              </div>
            </div>
          </div>

          <!-- Footer with Price and Buttons -->
          <div class="bg-white px-5 py-4 flex-shrink-0 border-t border-others-gray3">
            <div class="flex items-center justify-between gap-4">
              <!-- Price on Left -->
              <div class="flex-shrink-0">
                <div class="flex items-end font-bold whitespace-nowrap">
                  <div class="text-[12px] text-others-original">{{ currencyDisplay }}</div>
                  <div class="text-[22px] text-others-original leading-none">{{ formatPrice(priceTotal) }}</div>
                </div>
                <div v-if="taxMode === 'in'" class="text-[12px] pt-1 text-others-gray1">
                  <span class="font-bold text-[14px]">每人均價</span>(含稅及附加費)
                </div>
                <div v-else class="text-[12px] pt-1 text-others-gray1">
                  參考稅費&nbsp;{{ currencyDisplay }}&nbsp;{{ formatPrice(taxAmount ?? 0) }}
                </div>
              </div>

              <!-- Buttons on Right -->
              <div class="flex gap-3 flex-shrink-0 text-[14px]">
                <button
                  type="button"
                  class="px-4 py-3 rounded-[15px] text-others-gray7 bg-others-gray3 font-bold opacity-50 cursor-not-allowed transition whitespace-nowrap"
                  disabled
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
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Teleport } from 'vue'
import { formatPrice } from '@/utils'
import type { Sector } from '@/utils/types'
import FlightSectorDetail from './FlightInfoModalSector.vue'
import TransferInfo from './FlightInfoModalTransfer.vue'
import { resolveAirlineLogo } from '@/utils/airlineLogo'

const props = defineProps<{
  open: boolean
  sectors: Sector[]
  tripType: string
  priceTotal: number
  currencyDisplay: string
  taxMode: 'in' | 'ex'
  taxAmount?: number
  isLastStep?: boolean
}>()

function airlineLogoFor(sec: Sector) {
  const code = sec.marketingAirlineCode || sec.operatingAirlineCode
  return resolveAirlineLogo(code)
}

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'next-step'): void
}>()

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
