<template>
  <article
    :class="[
      'relative z-[50] hover:z-[999] rounded-[10px] shadow-[0px_2px_10px_rgba(0,0,0,0.15)] overflow-visible cursor-pointer md:cursor-default',
      props.isSelected ? 'bg-others-cardSelected md:bg-white' : 'bg-white'
    ]"
    @click="handleCardClick"
  >
    <!-- MOBILE LAYOUT -->
    <div class="md:hidden p-3 flex flex-col min-h-[120px]">
      <!-- Times (Top Row) -->
      <div class="flex items-center justify-center gap-3 mb-1.5">
        <div class="text-center flex-shrink-0 min-w-[80px]">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold">{{ departureTime }}</div>
        </div>

        <div class="relative flex flex-col items-center flex-shrink-0 w-36">
          <div class="relative w-36 h-10 flex items-center justify-center">
            <img class="w-36 h-10" src="@/assets/imgs/arrow-right-long.svg" />
            <div v-if="stopsCount >= 1" class="absolute top-[19px] border-2 border-primary-gold bg-white rounded-full w-3 h-3"></div>
          </div>
        </div>

        <div class="text-center flex-shrink-0 min-w-[80px]">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold relative inline-block">
            {{ arrivalTime }}
            <span v-if="crossDays && crossDays > 0" class="absolute -top-1 -right-4 text-[12px] text-others-original font-normal">+{{ crossDays }}</span>
          </div>
        </div>
      </div>

      <!-- Airports and Duration (Bottom Row - Aligned with Top) -->
      <div class="flex items-center justify-center gap-3 mb-1.5">
        <div class="text-center flex-shrink-0 min-w-[80px]">
          <div class="text-sm text-others-gray1">{{ departureAirportCode }} {{ departureTerminal }}</div>
        </div>

        <div class="text-center flex-shrink-0 w-36">
          <div class="text-sm text-others-gray1">{{ totalDurationText }}</div>
        </div>

        <div class="text-center flex-shrink-0 min-w-[80px]">
          <div class="text-sm text-others-gray1">{{ arrivalAirportCode }} {{ arrivalTerminal }}</div>
        </div>
      </div>

      <!-- Bottom Row: Airline (Left) + Price (Right) -->
      <div class="flex items-end justify-between gap-4 mt-auto">
        <!-- Airline (Left) -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <img
            v-if="airlines.length <= 1"
            :src="airlines[0]?.logo"
            :alt="airlines[0]?.name || 'airline'"
            class="w-5 h-5 object-contain"
            @error="onImageError"
          />
          <img
            v-else
            :src="AirlineTwo"
            :alt="'airlines'"
            class="w-5 h-5 object-contain"
            @error="onImageError"
          />
          <div class="text-[10px] text-others-gray7 font-bold">
            <div v-if="airlines.length <= 1">{{ airlines[0]?.name }}</div>
            <div v-else>
              <div v-for="a in airlines" :key="a.code">{{ a.name }}</div>
            </div>
          </div>
        </div>

        <!-- Price (Right) -->
        <div class="text-right flex-shrink-0" :class="{ 'invisible': leg === 'return' && expanded1 }">
          <div class="flex items-end justify-end font-bold whitespace-nowrap">
            <div class="text-[12px] text-others-original">{{ currencyDisplay }}&nbsp;</div>
            <div class="text-[24px] text-others-original leading-none">{{ formatPrice(priceTotal) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- DESKTOP LAYOUT -->
    <div class="hidden md:flex items-center gap-4 px-5 py-4">
      <!-- Airlines block -->
      <div
        class="relative group flex items-center gap-2 min-w-[150px]"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <img
          v-if="airlines.length <= 1"
          :src="airlines[0].logo"
          :alt="airlines[0]?.name || 'airline'"
          class="w-10 h-10 object-contain"
          @error="onImageError"
        />
        <img
          v-else
          :src="AirlineTwo"
          :alt="airlines[0]?.name || 'airlines'"
          class="w-10 h-10 object-contain"
          @error="onImageError"
        />
        <div class="leading-tight">
          <div v-if="airlines.length <= 1" class="text-[16px] text-others-gray7 font-bold">
            {{ airlines[0]?.name }}
          </div>
          <div v-else class="text-[16px] text-others-gray7 font-bold">
            <div v-for="a in airlines" :key="a.code">{{ a.name }}</div>
          </div>
        </div>

        <!-- Tooltip via Teleport -->
        <Teleport to="body">
          <Transition name="fade-scale">
            <div
              v-if="showTooltip"
              :style="tooltipStyle"
              class="fixed w-[220px] rounded-[10px] bg-white drop-shadow-[0px_2px_10px_rgba(0,0,0,0.15)] p-3 z-[9999]"
              role="tooltip"
            >
              <ul class="divide-y divide-others-gray3">
                <li
                  v-for="a in airlines"
                  :key="a.code"
                  class="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                >
                  <div class="flex items-center gap-2">
                    <img 
                      v-if="a.logo"
                      class="w-6 h-6 object-contain rounded-sm" 
                      :src="a.logo"
                      :alt="a.name"
                      @error="onImageError"
                    />
                    <span class="text-others-gray7">{{ a.name }}</span>
                  </div>
                  <span class="text-others-gray7 font-semibold">{{ a.code }}</span>
                </li>
              </ul>
            </div>
          </Transition>
        </Teleport>
      </div>

      <!-- Times -->
      <div class="flex items-center gap-3 flex-1 justify-between min-w-0">
        <div class="text-center flex-shrink-0">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold">{{ departureTime }}</div>
          <div class="text-sm text-others-gray1">{{ departureAirportCode }} {{ departureTerminal }}</div>
        </div>

        <div class="relative flex flex-col items-center flex-shrink-0">
          <div class="relative w-10 h-10 flex items-center justify-center">
            <img class="absolute w-10" src="@/assets/imgs/arrow-right.svg"  />
            <div v-if="stopsCount >= 1" class="absolute top-[17px] border-2 border-primary-gold bg-white rounded-full w-3 h-3"></div>
          </div>
          <p :class="[stopsCount >= 1 ? 'block' : 'hidden']" class="absolute w-max bottom-[-15px] text-others-original">
            轉機{{ stopsCount }}次
          </p>
        </div>

        <div class="text-center flex-shrink-0">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold relative inline-block">
            {{ arrivalTime }}
            <span v-if="crossDays && crossDays > 0" class="absolute -top-1 -right-4 text-[12px] text-others-original font-normal">+{{ crossDays }}</span>
          </div>
          <div class="text-sm text-others-gray1">{{ arrivalAirportCode }} {{ arrivalTerminal }}</div>
        </div>

        <div class="ml-2 text-right flex-shrink-0 min-w-[90px]">
          <div class="text-[14px] text-others-gray1 whitespace-nowrap">{{ totalDurationText }}</div>

          <!-- toggle -->
          <button
            class="text-[16px] font-bold text-primary-gold hover:opacity-80 inline-flex items-center gap-1 whitespace-nowrap"
            @click="expanded = !expanded"
            :aria-expanded="expanded"
            type="button"
          >
            航班資訊
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path :d="!expanded ? 'M18 10l-6 6-6-6' : 'M6 14l6-6 6 6'" />
            </svg>
          </button>
        </div>

        <!-- Price & CTA -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="text-right min-w-[170px]" :class="{ 'invisible': leg === 'return' && expanded1 }">
            <div class="flex items-end justify-end font-bold whitespace-nowrap">
              <div class="text-[12px] text-others-original">{{ currencyDisplay }}</div>
              <div class="text-[28px] text-others-original leading-none">{{ formatPrice(priceTotal) }}</div>
              <div class="text-[12px] text-others-gray1">&nbsp; 起</div>
            </div>
            <div v-if="taxMode == 'in'" class="text-[12px] pt-1 text-others-gray1 whitespace-nowrap text-right">
              <span class="font-bold text-[14px]">每人均價</span>(含稅及附加費)
            </div>
            <div v-else class="text-[12px] pt-1 text-others-gray1 whitespace-nowrap text-right">{{ '參考稅費'  }}&nbsp;{{ currencyDisplay }}&nbsp;{{ formatPrice(taxAmount ?? 0) }}</div>
          </div>

          <button
            v-if="leg === 'outbound'"
            class="min-w-[98px] px-5 py-3 rounded-[15px] text-white bg-primary-gold font-bold hover:bg-primary-gold1 flex-shrink-0"
            @click="goReturn"
            type="button"
          >
            <p class="whitespace-nowrap">選擇</p>
          </button>
          <button
            v-if="leg === 'return'"
            class="flex items-center gap-2 min-w-[98px] px-5 py-3 rounded-[15px] text-white font-bold flex-shrink-0"
            :class="expanded1 ? 'bg-others-gray3 hover:bg-others-gray5' : 'bg-primary-gold hover:bg-primary-gold3'"
            @click="toggleFareOptions"
            type="button"
          >
            <p class="whitespace-nowrap">{{ expanded1 ? '收起' : '選擇' }}</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path :d="!expanded1 ? 'M18 10l-6 6-6-6' : 'M6 14l6-6 6 6'" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- BODY (expanded) -->
    <Transition name="fade">
      <div v-if="expanded" class="bg-[#E5E5E5]" :class="[!expanded1 ? 'rounded-b-[10px]' : '']">
        <!-- Timeline for each sector -->
        <div v-for="(sec, i) in sectors" :key="i">
          <div class="grid grid-cols-12 gap-4 py-8 px-8">
            <!-- left dates/times -->
            <div class="flex items-center flex-col justify-between col-span-12 md:col-span-3">
              <div class="flex flex-row items-center justify-between gap-6">
                <div class="text-others-gray1">{{ formatDateToChinese(sec.departureDate) }}</div>
                <div class="font-bold text-others-gray7">{{ sec.departureTime }}</div>
              </div>
              <div class="text-others-gray1">{{ toDuration(sec.durationMinutes) }}</div>
              <div class="flex items-center justify-between gap-6">
                <div class="text-others-gray1">{{ formatDateToChinese(sec.arrivalDate) }}</div>
                <div class="font-bold text-others-gray7 relative">
                  {{ sec.arrivalTime }}
                  <span v-if="sec.crossDays && sec.crossDays > 0" class="absolute -top-1 -right-4 text-[10px] text-others-original font-normal">+{{ sec.crossDays }}</span>
                </div>
              </div>
            </div>

            <!-- vertical line w/ dots (hidden on mobile) -->
            <div class="hidden relative md:block mx-6">
              <span class="absolute -left-[6px] top-0 w-[14px] h-[14px] rounded-full bg-white"></span>
              <div class="w-[3px] h-full bg-white"></div>
              <span class="absolute -left-[6px] bottom-0 w-[14px] h-[14px] rounded-full bg-white"></span>
            </div>

            <!-- right info -->
            <div class="col-span-12 md:col-span-8 space-y-2">
              <div class="font-bold text-others-gray7">
                {{ sec.departureAirportCode }} {{ sec.departureAirportName }} {{ sec.departureTerminal }} {{ sec.departureCityName }}
              </div>
              <div class="flex items-center gap-2 text-others-gray1">
                <img
                  v-if="airlineLogoFor(sec)"
                  :src="airlineLogoFor(sec)"
                  :alt="sec.marketingAirlineName || sec.operatingAirlineName"
                  class="w-5 h-5 object-contain"
                  @error="onImageError"
                />
                <span class="font-semibold">{{ sec.flightNo || sec.operatingFlightNo }}</span>
                <span class="text-others-gray1">{{ sec.marketingAirlineName || sec.operatingAirlineName }}</span>
                <span class="text-others-gray1">{{ sec.craft?.craftName ? ' ' + sec.craft.craftName : '' }}</span>
              </div>
              <div class="font-bold text-others-gray7">
                {{ sec.arrivalAirportCode }} {{ sec.arrivalAirportName }} {{ sec.arrivalTerminal }} {{ sec.arrivalCityName }}
              </div>
            </div>
          </div>

          <!-- transfer chips (between legs) -->
          <div v-if="i < sectors.length - 1 && sec.transfer" class="mx-10 my-2 text-others-gray1">
            <div class="inline-flex items-center gap-2 bg-white rounded-[10px] px-6 py-2">
              <!-- 使用前一航段的到達城市作為轉機城市 -->
              <span>於{{ sec.arrivalCityName || sec.transfer.transferCity }}轉機</span>
              <span class="text-others-gray3">|</span>
              <span class="text-others-original">{{ toDuration(sec.transfer.transferStayMinutes) }}</span>
              <!-- 只有在真的不同航廈時才顯示 -->
              <template v-if="sec.transfer.isChangeTerminal">
                <span class="text-others-gray3">|</span>
                <span class="text-others-original">不同航廈</span>
              </template>
              <!-- 只有在真的不同機場（機場代碼不同）時才顯示 -->
              <template v-if="shouldShowDifferentAirport(i)">
                <span class="text-others-gray3">|</span>
                <span class="text-others-original">不同機場</span>
              </template>
              <!-- 行李直掛 -->
              <template v-if="sec.baggageStraight > 0">
                <span class="text-others-gray3">|</span>
                <span class="text-others-original">行李直掛</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- BODY (expanded1) -->
    <Transition name="fade">
      <div v-if="expanded1" class="bg-[#E5E5E5] rounded-b-[10px]">
        <!-- Loading state with skeleton -->
        <div v-if="fareRule.fareRuleLoading.value" class="bg-white rounded-b-[10px] overflow-hidden">
          <!-- Skeleton fare options (show 2-3 placeholder rows) -->
          <div v-for="n in 2" :key="`skeleton-${n}`" class="relative grid grid-cols-12 gap-4 p-5 border-b border-others-gray3">
            <!-- Cabin skeleton -->
            <div class="col-span-12 md:col-span-2 flex items-center justify-center">
              <div class="skel h-6 w-20 rounded"></div>
            </div>
            
            <!-- Notes skeleton -->
            <div class="col-span-12 md:col-span-6 space-y-3">
              <div class="flex items-center gap-2">
                <div class="skel h-4 w-4 rounded-full"></div>
                <div class="skel h-4 w-48 rounded"></div>
              </div>
              <div class="flex items-center gap-2">
                <div class="skel h-4 w-4 rounded-full"></div>
                <div class="skel h-4 w-56 rounded"></div>
              </div>
              <div class="flex items-center gap-2">
                <div class="skel h-4 w-4 rounded-full"></div>
                <div class="skel h-4 w-40 rounded"></div>
              </div>
              <div class="skel h-4 w-32 rounded"></div>
            </div>
            
            <!-- Price and button skeleton -->
            <div class="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-4">
              <div class="text-right space-y-2">
                <div class="skel h-8 w-32 rounded"></div>
                <div class="skel h-3 w-24 rounded"></div>
              </div>
              <div class="skel h-12 w-24 rounded-[10px]"></div>
            </div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="fareRule.fareRuleError.value && !fareRule.show404Dialog.value" class="p-8 text-center text-text-error">
          {{ fareRule.fareRuleError.value }}
        </div>

        <!-- Fare options -->
        <div v-else-if="visibleFares.length > 0" class="bg-white rounded-b-[10px] overflow-hidden">
          <div v-for="(fare, idx) in visibleFares" :key="idx" class="relative grid grid-cols-12 gap-4 p-5 border-others-gray3">
            <div v-if="idx >= 1" class="absolute mx-[2%] w-[96%] h-[1px] bg-others-gray3"></div>
            <div class="col-span-12 md:col-span-2 text-others-gray1 font-bold flex items-center justify-center">
              {{ fare.cabin }}
            </div>
            <ul class="col-span-12 md:col-span-6 space-y-2">
              <li v-for="(n, i) in fare.notes.filter(note => !note.text.includes('服務費'))" :key="i" class="flex items-center gap-2">
                <img :src="noteIcon(n.type as FareNoteType, n.icon as FareIconType)" />
                <span class="text-[14px] text-others-gray1">{{ n.text }}</span>
              </li>
              <li class="text-others-original text-[14px] font-bold cursor-pointer" @click="openBaggageInfoAndFeeRule">行李資訊及票價規定</li>
            </ul>
            <div class="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-4">
              <div class="text-right">
                <div class="flex items-end font-bold">
                  <div class="text-[12px] text-others-original">{{ currencyDisplay }}</div>
                  <div class="text-[28px] text-others-original leading-none">
                    {{ formatPrice(taxMode === 'in' ? fare.price : (fare.price - fare.taxAmount)) }}
                  </div>
                </div>
                <div class="text-[12px] pt-2 text-others-gray1">
                  <template v-if="taxMode === 'in'">
                    <span class="font-bold text-[14px]">每人均價</span>(含稅及附加費)
                  </template>
                  <template v-else>
                    參考稅費&nbsp;{{ currencyDisplay }}&nbsp;{{ formatPrice(fare.taxAmount) }}
                  </template>
                </div>
              </div>
              <button class="bg-others-original hover:bg-others-hover min-w-[98px] text-white font-bold rounded-[10px] px-6 py-3" @click="goBooking(fare)" type="button">
                訂購
              </button>
            </div>
          </div>

          <div v-if="(fareRule.dynamicFareOptions.value.length > 0 ? fareRule.dynamicFareOptions.value.length : (fareOptions?.length ?? 0)) > fareRule.fareShow.value" class="p-4 flex justify-end">
            <button class="flex items-center w-fit text-others-original hover:opacity-80" @click="fareRule.fareShow.value = (fareRule.dynamicFareOptions.value.length > 0 ? fareRule.dynamicFareOptions.value.length : (fareOptions?.length ?? 0))">
              <span>顯示更多</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 fill-none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 10l-6 6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <!-- No data state -->
        <div v-else class="p-8 text-center text-others-gray1">
          暫無票價資訊
        </div>
      </div>
    </Transition>

    <!-- Mobile Action Modal -->
    <FlightActionModal
      :open="modals.isMobileModalOpen.value"
      :price-total="priceTotal"
      :currency-display="currencyDisplay"
      :tax-mode="taxMode"
      :tax-amount="taxAmount"
      @close="modals.isMobileModalOpen.value = false"
      @flight-info="modals.handleMobileFlightInfo"
      @next-step="handleMobileNextStep"
    />

    <!-- Mobile Flight Info Modal (triggered by 航班資訊 button) -->
    <FlightInfoModal
      :open="modals.isFlightInfoModalOpen.value"
      :sectors="sectors"
      :trip-type="props.tripType"
      :price-total="priceTotal"
      :currency-display="currencyDisplay"
      :tax-mode="taxMode"
      :tax-amount="taxAmount"
      @close="modals.isFlightInfoModalOpen.value = false"
      @next-step="handleFlightInfoNextStep"
    />

    <!-- 404 Error Dialog -->
    <Transition name="fade">
      <div v-if="fareRule.show404Dialog.value" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
        @click.self="fareRule.show404Dialog.value = false">
        <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <div class="text-center">
            <h3 class="text-xl font-bold text-others-gray1 mb-4">無法取得票價規則</h3>
            <p class="text-others-gray7 mb-6">
              抱歉，目前無法取得此航班的票價規則資訊，請重新搜尋。
            </p>
            <button
              @click="handle404Confirm"
              class="px-6 py-2 bg-primary-gold text-white rounded-lg font-medium hover:bg-others-hover transition">
              確定
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </article>
</template>

<script setup lang="ts">
import { inject, computed, ref } from 'vue'
import { formatDateToChinese, formatPrice, noteIcon, toDuration } from '@/utils'
import type { FareIconType, FareNoteType, FareOption, Sector } from '@/utils/types'
import FlightActionModal from '@/components/ui/modals/FlightActionModal.vue'
import FlightInfoModal from '@/components/ui/modals/FlightInfoModal.vue'
import { useFlightCardData } from '@/composables/useFlightCardData'
import { useFlightFareRule } from '@/composables/useFlightFareRule'
import { useFlightModals } from '@/composables/useFlightModals'

// Icons
import AirlineTwo from '@/assets/imgs/airlines/airline-two.svg'

const props = defineProps<{
  tripType: string
  leg: 'outbound' | 'return'
  isSelected?: boolean
  // New-shape (v-bind="it")
  refNumber?: number
  price?: number
  taxAmount?: number
  departureDate?: string
  departureTime?: string
  arrivalDate?: string
  arrivalTime?: string
  crossDays?: number
  durationMinutes?: number
  departureCityCode?: string
  arrivalCityCode?: string
  departureCityName?: string
  arrivalCityName?: string
  departureAirportCode?: string
  departureAirportName?: string
  arrivalAirportCode?: string
  arrivalAirportName?: string
  departureTerminal?: string
  arrivalTerminal?: string
  airlineName?: string[]
  airlineCode?: string[]
  sectors?: Sector[]

  // UI extras
  currency?: string
  priceFrom?: number
  taxMode?: string
  roundTripIncluded?: boolean
  fareOptions?: FareOption[]
  defaultOpen?: boolean
  defaultOpen1?: boolean

  /** Optional: map airline code -> logo url */
  airlineLogos?: Record<string, string>
  /** Optional: custom resolver if you need dynamic mapping */
  getAirlineLogo?: (code: string) => string | undefined
  
  /** For multi-segment search */
  adultCount?: number
  childCount?: number
  babyCount?: number
  
  /** Previously selected segments (for fare-rule API) */
  previousSegments?: Array<{ sectors: Sector[] }>
  
  /** New fields from flight-search response */
  validatingAirlineCode?: string
  itineraryRBDs?: string | string[]
}>()

/** Emits (new-shape payload, richer)**/
const emit = defineEmits<{
  (e: 'card-click'): void
  (e: 'select', payload: {
    refNumber?: number
    sectors: Sector[]
    totalMinutes: number
    stopsCount: number
    totalPrice: number
    taxAmount?: number
    currency: string
    roundTripIncluded?: boolean
    header: {
      departureTime: string
      arrivalTime: string
      departureAirportCode: string
      arrivalAirportCode: string
      departureTerminal: string
      arrivalTerminal: string
    }
  }): void
  (e: 'purchase', payload: { 
    fare: FareOption; 
    refNumber?: number;
    fareRuleData?: any;
  }): void
}>()

/** -------------------- State -------------------- */
const expanded = ref(!!props.defaultOpen)
const expanded1 = ref(!!props.defaultOpen1)

/** -------------------- Composables -------------------- */
const cardData = useFlightCardData(() => ({
  sectors: props.sectors,
  airlineCode: props.airlineCode,
  airlineName: props.airlineName,
  departureTime: props.departureTime,
  arrivalTime: props.arrivalTime,
  departureAirportCode: props.departureAirportCode,
  arrivalAirportCode: props.arrivalAirportCode,
  departureTerminal: props.departureTerminal,
  arrivalTerminal: props.arrivalTerminal,
  durationMinutes: props.durationMinutes,
  currency: props.currency,
  priceFrom: props.priceFrom,
  taxMode: props.taxMode
}))

const fareRule = useFlightFareRule(() => ({
  sectors: props.sectors,
  previousSegments: props.previousSegments,
  tripType: props.tripType,
  leg: props.leg,
  adultCount: props.adultCount,
  childCount: props.childCount,
  babyCount: props.babyCount,
  validatingAirlineCode: props.validatingAirlineCode,
  itineraryRBDs: props.itineraryRBDs,
  fareOptions: props.fareOptions,
  // 直接使用列表上的價格（props.price 已經是含稅價）
  flightSearchPrice: props.price,
  flightSearchTaxAmount: props.taxAmount
}))

const modals = useFlightModals()

/** -------------------- Derived -------------------- */
const sectors = cardData.sectors
const airlines = cardData.airlines
const departureTime = cardData.departureTime
const arrivalTime = cardData.arrivalTime
const departureAirportCode = cardData.departureAirportCode
const arrivalAirportCode = cardData.arrivalAirportCode
const departureTerminal = cardData.departureTerminal
const arrivalTerminal = cardData.arrivalTerminal
const totalMinutes = cardData.totalMinutes
const totalDurationText = computed(() => toDuration(totalMinutes.value))
const stopsCount = cardData.stopsCount
const currencyDisplay = cardData.currencyDisplay
const priceTotal = cardData.priceTotal
const taxMode = cardData.taxMode
const visibleFares = fareRule.visibleFares

function airlineLogoFor(sec: Sector) {
  return cardData.airlineLogoFor(sec)
}

const onImageError = cardData.onImageError

// Tooltip state for desktop airline display
const showTooltip = ref(false)
const tooltipStyle = ref<{ top: string; left: string }>({ top: '0px', left: '0px' })

function onMouseEnter(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tooltipStyle.value = { top: `${rect.bottom + 8}px`, left: `${rect.left}px` }
  showTooltip.value = true
}

function onMouseLeave() {
  showTooltip.value = false
}

/** -------------------- Transfer logic -------------------- */
/**
 * 判斷是否應該顯示「不同機場」標記
 * 只有當前航段的出發機場代碼與前一航段的抵達機場代碼不同時才顯示
 */
function shouldShowDifferentAirport(sectorIndex: number): boolean {
  if (sectorIndex >= sectors.value.length - 1) return false
  
  const currentSector = sectors.value[sectorIndex]
  const nextSector = sectors.value[sectorIndex + 1]
  
  // 比較當前航段的抵達機場與下一航段的出發機場
  // 如果機場代碼不同，表示真的是不同機場
  return currentSector.arrivalAirportCode !== nextSector.departureAirportCode
}

/** -------------------- Shared actions -------------------- */
interface SharedData { 
  isOpenBaggageInfoAndFeeRule?: boolean; 
  isSearch?: boolean;
  fareRuleData?: any;
}
const updateValue = inject<(val: SharedData) => void>('updateValue')
function openBaggageInfoAndFeeRule() { 
  updateValue?.({ 
    isOpenBaggageInfoAndFeeRule: true,
    fareRuleData: fareRule.fareRuleData.value 
  }) 
}

/** -------------------- Mobile handlers -------------------- */
function handleCardClick(e: MouseEvent) {
  // Only handle on mobile (screen width < 768px)
  if (window.innerWidth >= 768) return
  
  // Don't open modal if clicking on interactive elements
  const target = e.target as HTMLElement
  if (
    target.closest('button') ||
    target.closest('a') ||
    expanded.value ||
    expanded1.value
  ) {
    return
  }
  
  // Emit card-click event to parent (ResultsMain) to handle shared modal state
  emit('card-click')
}

async function handleMobileNextStep() {
  modals.isMobileModalOpen.value = false
  
  if (props.leg === 'outbound') {
    goReturn()
  } else {
    await proceedToBooking()
  }
}

async function handleFlightInfoNextStep() {
  modals.isFlightInfoModalOpen.value = false
  
  if (props.leg === 'outbound') {
    goReturn()
  } else {
    await proceedToBooking()
  }
}

async function proceedToBooking() {
  // For roundtrip and multi trips, fetch fare rules if needed
  if ((props.tripType === 'roundtrip' || props.tripType === 'multi') && !fareRule.fareRuleData.value && !fareRule.fareRuleLoading.value) {
    await fareRule.fetchFareRule()
  }
  
  const availableFares = visibleFares.value.length > 0 ? visibleFares.value : (props.fareOptions ?? [])
  
  if (availableFares.length > 0) {
    goBooking(availableFares[0])
  } else if (props.tripType === 'oneway' || props.tripType === 'multi') {
    // For oneway and multi trips, create default fare if no fare options available
    goBooking({
      id: 'default-fare',
      cabin: sectors.value[0]?.cabinDesc || '經濟艙',
      price: priceTotal.value - (props.taxAmount ?? 0),
      taxAmount: props.taxAmount ?? 0,
      notes: []
    })
  }
}

/** -------------------- Emits -------------------- */
function goReturn() {
  emit('select', {
    refNumber: props.refNumber,
    sectors: sectors.value,
    totalMinutes: totalMinutes.value,
    stopsCount: stopsCount.value,
    totalPrice: priceTotal.value,
    taxAmount: props.taxAmount || 0,
    currency: currencyDisplay.value,
    roundTripIncluded: props.roundTripIncluded,
    header: {
      departureTime: departureTime.value,
      arrivalTime: arrivalTime.value,
      departureAirportCode: departureAirportCode.value,
      arrivalAirportCode: arrivalAirportCode.value,
      departureTerminal: departureTerminal.value,
      arrivalTerminal: arrivalTerminal.value,
    },
  })
}
function goBooking(fare: FareOption) {
  emit('purchase', { 
    fare, 
    refNumber: props.refNumber,
    fareRuleData: fareRule.fareRuleData.value 
  })
}

async function toggleFareOptions() {
  if (!expanded1.value) {
    expanded1.value = true
    if (!fareRule.fareRuleData.value && !fareRule.fareRuleLoading.value) {
      await fareRule.fetchFareRule()
    }
  } else {
    expanded1.value = false
  }
}

function handle404Confirm() {
  fareRule.handle404Confirm()
}
</script>

<style scoped>
/* .fade-scale-enter-active,
.fade-scale-leave-active { transition: all 0.18s ease; }
.fade-scale-enter-from,
.fade-scale-leave-to { transform: translateY(4px) scale(0.95); } */

/* Skeleton loading animation */
.skel {
  position: relative;
  overflow: hidden;
  background: #F5F5F5;
}
.skel::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: shimmer 1.4s ease-in-out infinite;
}
@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* Fade transition for 404 dialog */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>