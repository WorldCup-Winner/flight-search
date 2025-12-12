<template>
    <div class="w-full min-h-screen flex flex-col items-center">
      <div class="max-w-6xl w-full">
        <!-- Main white card -->
        <div class="bg-white rounded-[10px]  w-full">
          <!-- Route header -->
          <div class="w-full flex items-center gap-2 bg-white text-others-gray7 text-[17px] rounded-t-[10px] px-5 py-4 font-bold">
            <!-- Round-trip: Show origin ↔ destination -->
            <template v-if="routeDisplayType === 'roundtrip'">
              <span>{{ routeOrigin }}</span>
              <img src="@/assets/imgs/arrow-both.svg" alt="往返" />
              <span>{{ routeDestination }}</span>
            </template>
            
            <!-- Multi-trip: Show simplified label -->
            <template v-else-if="routeDisplayType === 'multitrip'">
              <span class="text-others-gray7 font-bold text-lg">多行程&nbsp;|&nbsp;</span>
              <span class="text-others-gray5 text-lg">確認與預訂</span>
            </template>
            
            <!-- One-way or multi-segment: Show full route with arrows -->
            <template v-else-if="routeDisplayType === 'route'">
              <template v-for="(segment, index) in segments" :key="index">
                <span>{{ getSegmentDeparture(segment) }}</span>
                <img src="@/assets/imgs/arrow-right.svg" :alt="`第${index + 1}段`" />
                <span>{{ getLastSegmentArrival(segment) }}</span>
                <span
                  v-if="index < segments.length - 1"
                  class="mx-2 text-divider-medium"
                >
                  |
                </span>
              </template>
            </template>
  
            <!-- Edit button on the right (same as StepTwo, behavior TBD) -->
            <button
              type="button"
              class="ml-auto inline-flex items-center gap-1 rounded-md border border-others-gray3 bg-white px-2 py-1 text-[12px] font-medium text-others-gray7 transition hover:text-others-original hover:border-others-original"
              @click="handleEditSearch"
            >
              <font-awesome-icon icon="pen" class="text-[11px]" />
              <span class="leading-none">修改</span>
            </button>
          </div>
  
          <!-- Segments / itinerary -->
          <div class="px-5 py-6">
            <div
              v-for="(segment, segmentIndex) in segments"
              :key="segmentIndex"
              class="relative w-full mb-10"
            >
              <div class="space-x-4 text-sm">
                <span class="px-5 py-3 rounded-[15px] rounded-br-none text-white bg-others-original">
                  {{ getSegmentTitle(segmentIndex) }}
                </span>
                <span class="text-others-gray7 text-xs">
                  {{ formatDateToChineseWithWeek(segment.sectors[0]?.departureDate) }}&nbsp;&nbsp;
                  飛行時間 {{
                    toDuration(
                      segment.sectors.reduce(
                        (sum: number, sec: any) => sum + (sec.durationMinutes || 0),
                        0
                      ) || 0
                    )
                  }}
                </span>
              </div>
  
              <div
                v-for="(sec, i) in segment.sectors"
                :key="i"
                class="ml-2 mt-2"
              >
                <div class="grid grid-cols-12 gap-4 p-4">
                  <div class="flex items-center flex-col text-xs justify-between col-span-4">
                    <div class="flex flex-row items-center justify-between gap-2">
                      <div class="text-others-gray1">
                        {{ formatDateToChinese(sec.departureDate) }}
                      </div>
                      <div class="font-bold text-others-gray7">
                        {{ sec.departureTime }}
                      </div>
                    </div>
                    <div class="text-others-gray1">
                      {{ toDuration(sec.durationMinutes) }}
                    </div>
                    <div class="flex items-center justify-between gap-2">
                      <div class="text-others-gray1">
                        {{ formatDateToChinese(sec.arrivalDate) }}
                      </div>
                      <div class="font-bold text-others-gray7">
                        {{ sec.arrivalTime }}
                      </div>
                    </div>
                  </div>
  
                  <div class="relative mx-2">
                    <span class="absolute -left-[6px] top-0 w-[14px] h-[14px] rounded-full bg-others-gray3"></span>
                    <div class="w-[3px] h-full bg-others-gray3"></div>
                    <span class="absolute -left-[6px] bottom-0 w-[14px] h-[14px] rounded-full bg-others-gray3"></span>
                  </div>
  
                  <div class="col-span-7 space-y-2 text-xs">
                    <div class="font-bold text-others-gray7">
                      {{ sec.departureAirportCode }} {{ sec.departureAirportName }}
                      {{ sec.departureTerminal }} {{ sec.departureCityName }}
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
                      <span class="text-others-gray1">
                        {{ sec.marketingAirlineName || sec.operatingAirlineName }}
                      </span>
                      <span class="text-others-gray1">
                        {{ sec.craft?.craftName ? ' ' + sec.craft.craftName : '' }}
                      </span>
                    </div>
                    <div class="font-bold text-others-gray7">
                      {{ sec.arrivalAirportCode }} {{ sec.arrivalAirportName }}
                      {{ sec.arrivalTerminal }} {{ sec.arrivalCityName }}
                    </div>
                  </div>
                </div>
  
                <!-- Transfer chip -->
                <div
                  v-if="i < segment.sectors.length - 1 && sec.transfer"
                  class="mx-2 my-2 text-others-gray1"
                >
                  <div class="inline-flex items-center gap-2 bg-tb-body rounded-[10px] px-2 py-2 text-xs">
                    <span>於{{ sec.transfer.transferCity }}轉機</span>
                    <span class="text-others-gray3">|</span>
                    <span class="text-others-original">
                      {{ toDuration(sec.transfer.transferStayMinutes) }}
                    </span>
                    <span
                      class="text-others-gray3"
                      v-if="sec.transfer.isChangeTerminal"
                    >|</span>
                    <span
                      v-if="sec.transfer.isChangeTerminal"
                      class="text-others-original"
                    >不同航廈</span>
                    <span
                      class="text-others-gray3"
                      v-if="sec.transfer.isChangeAirport"
                    >|</span>
                    <span
                      v-if="sec.transfer.isChangeAirport"
                      class="text-others-original"
                    >不同機場</span>
                    <span v-if="sec.baggageStraight > 0">｜ 行李直掛</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Selected fare summary -->
          <!-- Selected fare summary (with loading skeleton) -->
          <div
            class="relative bg-white rounded-b-[10px] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] mx-4 mb-4 p-4"
          >
            <template v-if="selectedFare">
            <div class="text-others-gray1 font-bold text-lg mb-4">
              {{ selectedFare.cabin }}
            </div>
  
            <!-- Price -->
            <div class="flex flex-col items-end mb-4">
              <div class="flex items-end font-bold">
                <div class="text-[12px] text-others-original pr-1">{{ currency }}</div>
                <div class="text-[28px] text-others-original leading-none">
                  {{ formatPrice(totalWithTax) }}
                </div>
              </div>
              <div class="text-[12px] text-others-gray1 mt-1">
                每人均價(含稅及附加費)
              </div>
            </div>
  
            <!-- Notes -->
            <ul class="space-y-2 mb-4">
              <li
                v-for="(n, i) in selectedFare.notes"
                :key="i"
                class="flex items-center gap-2 text-others-gray1"
              >
                <img :src="noteIcon(n.type, n.icon)" class="w-5 h-5 flex-shrink-0" />
                <span class="text-[14px]">{{ n.text }}</span>
              </li>
            </ul>
  
            <!-- Bottom actions -->
            <div class="flex items-center justify-between pt-4 border-t border-others-gray3">
              <button
                class="text-others-original text-[14px] font-semibold hover:text-others-hover transition-colors"
                @click="openBaggageInfoAndFeeRule"
              >
                行李資訊及票價規定
              </button>
              <button
                class="px-6 py-3 rounded-[10px] text-white bg-others-original font-bold hover:bg-others-hover transition-colors whitespace-nowrap"
                @click="handleConfirm"
              >
                訂購
              </button>
            </div>
            </template>
          </div>
        </div>
      </div>
  
      <!-- Baggage & fee rule popup -->
      <Transition name="fade">
        <BaggageInfoAndFeeRule
          v-if="isBaggageInfoOpen"
          :open="isBaggageInfoOpen"
          :fare-rule-data="bookingStore.fareRuleData || undefined"
          @close="isBaggageInfoOpen = false"
        />
      </Transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue'
  import { formatDateToChinese, formatPrice, toDuration, noteIcon } from '@/utils'
  import { useBookingStore } from '@/stores/booking'
  import BaggageInfoAndFeeRule from '@/components/ui/booking/BaggageInfoAndFeeRule.vue'
  import { resolveAirlineLogo, onAirlineImageError, AirlineDefault } from '@/utils/airlineLogo'

  const bookingStore = useBookingStore()

  const segments = computed(() => bookingStore.segments || [])
  const selectedFare = computed<any | null>(() => (bookingStore.selectedFare as any) || null)

  // Determine route display type
  const routeDisplayType = computed<'roundtrip' | 'multitrip' | 'route' | 'empty'>(() => {
    if (segments.value.length === 0) return 'empty'
    if (bookingStore.isRoundTrip && segments.value.length >= 2) return 'roundtrip'
    if (bookingStore.isMultiTrip) return 'multitrip'
    return 'route'
  })

  // Route origin and destination for round-trip display
  const routeOrigin = computed(() => {
    if (segments.value.length === 0) return '出發地'
    return getSegmentDeparture(segments.value[0]) || '出發地'
  })

  const routeDestination = computed(() => {
    if (segments.value.length < 2) return '目的地'
    // For round-trip, destination is the arrival of the return segment
    return getLastSegmentArrival(segments.value[1]) || '目的地'
  })
  
  const currency = computed(() => {
    const firstSegment = segments.value[0] as any | undefined
    return firstSegment?.currency || 'TWD'
  })
  
  const totalWithTax = computed(() => {
    const fare = selectedFare.value
    if (!fare) return 0
    const base = Number(fare.price ?? 0)
    const tax = Number(fare.taxAmount ?? 0)
    return base + tax
  })
  
  const isBaggageInfoOpen = ref(false)
  
  function openBaggageInfoAndFeeRule() {
    isBaggageInfoOpen.value = true
  }
  
  const emit = defineEmits<{
    (e: 'confirm'): void
    (e: 'edit-segment'): void
  }>()
  
  function handleConfirm() {
    emit('confirm')
  }
  
  // Edit search – delegate to ResultsMain, same as HeaderStrip
  function handleEditSearch() {
    emit('edit-segment')
  }
  
  // Segment helpers (duplicated from StepTwo for clarity and isolation)
  function getSegmentTitle(segmentIndex: number): string {
    if (bookingStore.isMultiTrip) {
      return `行程${segmentIndex + 1}`
    } else if (bookingStore.isRoundTrip) {
      return segmentIndex === 0 ? '去程' : '回程'
    } else {
      return '去程'
    }
  }
  
  function getSegmentDeparture(segment: any): string {
    if (segment?.sectors && segment.sectors.length > 0) {
      return (
        segment.sectors[0].departureCityName ||
        segment.sectors[0].departureAirportName ||
        '出發地'
      )
    }
    return '出發地'
  }
  
  function getLastSegmentArrival(segment: any): string {
    if (segment?.sectors && segment.sectors.length > 0) {
      const lastSector = segment.sectors[segment.sectors.length - 1]
      return lastSector.arrivalCityName || lastSector.arrivalAirportName || '目的地'
    }
    return '目的地'
  }
  
  // Airline logo helper
  function airlineLogoFor(sector: any): string | undefined {
    if (!sector?.marketingAirlineCode) return AirlineDefault
    return resolveAirlineLogo(sector.marketingAirlineCode)
  }
  
  // Image error handler
  function onImageError(event: Event) {
    onAirlineImageError(event)
  }
  
  // Local reimplementation of formatDateToChineseWithWeek (kept here to avoid cross-file coupling)
  function formatDateToChineseWithWeek(dateStr: string): string {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return ''
  
      const weekdays = ['日', '一', '二', '三', '四', '五', '六']
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekday = weekdays[date.getDay()]
  
      return `${year}年${month}月${day}日 (${weekday})`
    } catch {
      return ''
    }
  }
  </script>
  
  
  