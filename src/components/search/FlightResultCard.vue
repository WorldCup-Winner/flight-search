<template>
  <article class="rounded-[10px] bg-white drop-shadow-[0px_2px_10px_rgba(0,0,0,0.05)] overflow-hidden">
    <!-- HEADER (always visible) -->
    <div class="flex items-center gap-5 px-6 py-4">
      <!-- Airlines block -->
      <div class="flex items-center gap-3 min-w-[160px]">
        <img v-if="airlines?.[0]?.logo" :src="airlines[0].logo" :alt="airlines[0].name"
          class="w-10 h-10 object-contain" />
        <div class="leading-tight">
          <!-- single or stacked names -->
          <div v-if="airlines.length <= 1" class="text-[16px] text-others-gray7 font-bold">
            {{ airlines[0]?.name }}
          </div>
          <div v-else class="text-[16px] text-others-gray7 font-bold">
            <div v-for="a in airlines" :key="a.name">{{ a.name }}</div>
          </div>
        </div>
      </div>

      <!-- Times -->
      <div class="flex items-center gap-6 flex-1 justify-between">
        <div class="text-center">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold">{{ head.dep.time }}</div>
          <div class="text-sm text-others-gray1">{{ head.dep.code }} {{ head.dep.terminal }}</div>
        </div>

        <div class="">
          <img src="@/assets/imgs/arrow-right.svg" />
        </div>

        <div class="text-center">
          <div class="text-[24px] text-others-gray7 tracking-wide font-bold">{{ head.arr.time }}</div>
          <div class="text-sm text-others-gray1">{{ head.arr.code }} {{ head.arr.terminal }}</div>
        </div>

        <div class="ml-4 text-right">
          <div class="text-[15px] text-others-gray1">{{ totalDurationText }}</div>

          <!-- toggle -->
          <button class="text-[16px] font-bold text-primary-gold hover:opacity-80 inline-flex items-center gap-1"
            @click="expanded = !expanded" :aria-expanded="expanded" type="button">
            航班資訊
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path :d="expanded ? 'M5 12l5-5 5 5' : 'M5 8l5 5 5-5'" fill="currentColor" />
            </svg>
          </button>
        </div>

        <!-- Price & CTA -->
        <div class="flex items-center gap-4">
          <div class="text-right">
            <div class="flex items-end font-bold">
              <div class="text-[12px] text-others-original">{{ currency }}</div>
              <div class="text-[28px] text-others-original leading-none">
                {{ formatPrice(priceFrom) }}
              </div>
            </div>
            <div class="text-[12px] text-others-gray1">{{ roundTripIncluded ? '來回含稅價' : '含稅價' }}</div>
          </div>

          <button
            class="flex items-center gap-2 min-w-[98px] px-6 py-3 rounded-[15px] text-white font-bold hover:bg-primary-gold1"
            :class="expanded ? 'bg-primary-gold' : 'bg-primary-gold'" @click="expanded = !expanded" type="button">
            <p>{{ expanded ? '收起' : '選擇' }}</p>
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path :d="expanded ? 'M5 12l5-5 5 5' : 'M5 8l5 5 5-5'" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- BODY (expanded) -->
    <transition name="fade">
      <div v-if="expanded" class="bg-[#E5E5E5]">
        <!-- Timeline for each segment -->
        <div v-for="(seg, i) in segments" :key="i">
          <div class="grid grid-cols-12 gap-4 py-8">
            <!-- left dates/times -->
            <div class="flex items-center flex-col justify-between col-span-12 md:col-span-3">
              <div class="flex flex-row items-center justify-between gap-6">
                <div class="text-others-gray1">{{ seg.dep.date }}</div>
                <div class="font-bold text-others-gray7">{{ seg.dep.time }}</div>
              </div>
              <div class="text-others-gray1">
                {{ toDuration(seg.durationMinutes) }}
              </div>
              <div class="flex items-center justify-between gap-6">
                <div class="text-others-gray1">{{ seg.arr.date }}</div>
                <div class="font-bold text-others-gray7">{{ seg.arr.time }}</div>
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
                {{ seg.dep.airportName }}{{ seg.dep.terminal ? ' ' + seg.dep.terminal : '' }}
              </div>
              <div class="flex items-center gap-2 text-others-gray1">
                <img v-if="seg.carrier?.logo" :src="seg.carrier.logo" :alt="seg.carrier?.name"
                  class="w-5 h-5 object-contain" />
                <span class="font-semibold">
                  {{ seg.flightNo ? seg.flightNo : seg.carrier?.code }}
                </span>
                <span class="text-others-gray1"> {{ seg.carrier?.name }} </span>
                <span class="text-others-gray1"> {{ seg.equipment ? ' ' + seg.equipment : '' }}</span>
              </div>
              <div class="font-bold text-others-gray7">
                {{ seg.arr.airportName }}{{ seg.arr.terminal ? ' ' + seg.arr.terminal : '' }}
              </div>
            </div>
          </div>
            <!-- transfer chips (between legs) -->
            <div v-if="i < segments.length - 1 && transferNotes?.[i]" class="mx-6 my-4 text-others-gray1">
              <div class="inline-flex items-center gap-2 bg-white rounded-[10px] px-6 py-2">
                <span>於{{ transferNotes[i].location }}轉機</span> | 
                <span class="text-others-original">{{ toDuration(transferNotes[i].durationMinutes) }}</span> | 
                <span v-if="transferNotes[i].differentAirport" class="text-others-original">不同航廈</span> | 
                <span v-if="transferNotes[i].baggageThrough">行李直掛</span>
              </div>
            </div>
        </div>

        <!-- Fare options (optional) -->
        <div v-if="fareOptions?.length" class="mt-4 bg-white overflow-hidden">
          <div v-for="(fare, idx) in visibleFares" :key="idx"
            class="grid grid-cols-12 gap-4 p-5 border-b last:border-b-0 border-others-gray3">
            <div class="col-span-12 md:col-span-2 text-others-gray1 font-bold flex items-center justify-center">
              {{ fare.cabin }}
            </div>
            <ul class="col-span-12 md:col-span-6 space-y-2">
              <li v-for="(n, i) in fare.notes" :key="i" class="flex items-center gap-2">
                <img :src="noteIcon(n.type, n.icon)" />
                <span :class="noteTextClass(n.type)" class="text-[14px]">
                  {{ n.text }}
                </span>
              </li>
              <li class="text-others-original text-[14px] font-bold">行李資訊及票價規定</li>
            </ul>
            <div class="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-4">
              <div class="text-right">
                <div class="flex items-end font-bold">
                  <div class="text-[12px] text-others-original">{{ currency }}</div>
                  <div class="text-[28px] text-others-original leading-none">
                    {{ formatPrice(fare.price) }}
                  </div>
                </div>
                <div class="text-[12px] text-others-gray1">{{ roundTripIncluded ? '來回含稅價' : '含稅價' }}</div>
              </div>
              <button class="bg-others-original hover:bg-others-hover min-w-[98px] text-white font-bold rounded-[10px] px-6 py-3"
                @click="$emit('purchase', { fare })" type="button">
                訂購
              </button>
            </div>
          </div>

          <div v-if="fareOptions.length > fareShow" class="p-4 text-right">
            <button class="text-others-original font-bold hover:opacity-80" @click="fareShow = fareOptions.length">
              顯示更多 ▾
            </button>
          </div>
        </div>
      </div>
    </transition>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

/** -------------------- Types (loose) -------------------- */
type Airline = { name: string; logo?: string; code?: string }
type EndPoint = {
  date?: string; time: string; code?: string; terminal?: string; airportName?: string
}
type Segment = {
  dep: EndPoint; arr: EndPoint;
  carrier?: Airline; flightNo?: string; equipment?: string; durationMinutes?: number
}
type TransferNote = { location?: string; durationMinutes?: number; differentAirport?: boolean; baggageThrough?: boolean }
type FareNoteType = 'allowed' | 'permitted' | 'notallowed'
type FareIconType = 'suitcase' | 'ticket' | 'calendar' | 'clock' | 'info'
type FareOption = { id: string; cabin: string; price: number; notes: { type: FareNoteType; icon: FareIconType, text: string }[] }

const props = defineProps<{
  airlines: Airline[]
  segments: Segment[]
  head: { dep: EndPoint; arr: EndPoint }               // quick info for header
  durationMinutes: number
  stopsCount?: number                                  // 0=直飛, 1=轉機1次 ...
  priceFrom: number
  currency?: string
  roundTripIncluded?: boolean
  transferNotes?: TransferNote[]
  fareOptions?: FareOption[]
  defaultOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'purchase', payload: { fare: FareOption }): void
}>()

/** -------------------- State -------------------- */
const expanded = ref(!!props.defaultOpen)
const fareShow = ref(2)

/** -------------------- Computed -------------------- */
const currency = computed(() => props.currency ?? 'TWD')
const totalDurationText = computed(() => toDuration(props.durationMinutes))
const visibleFares = computed(() =>
  props.fareOptions ? props.fareOptions.slice(0, fareShow.value) : []
)

/** -------------------- Helpers -------------------- */
function toDuration(min?: number) {
  if (min == null) return ''
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}小時${m}分鐘`
}

function formatPrice(n: number) {
  return n.toLocaleString('en-US')
}

// ✅ Import all the icons eagerly; keys will be absolute paths starting with /src
const iconMap = import.meta.glob('/src/assets/imgs/rules/icon-*.svg', {
  eager: true,
  import: 'default'
}) as Record<string, string>

function noteIcon(type: FareNoteType, icon: FareIconType) {
  const key = `/src/assets/imgs/rules/icon-${icon}-${type}.svg`
  // optional: provide a safe fallback if a file is missing
  return iconMap[key] ?? iconMap['/src/assets/imgs/rules/icon-info-allowed.svg']
}

function noteTextClass(type: FareNoteType) {
  switch (type) {
    case 'allowed': return 'text-[#166534]'     // green-800
    case 'permitted': return 'text-[#991b1b]'     // red-800
    case 'notallowed': return 'text-[#92400e]'     // amber-800
    default: return 'text-[#6b7280]'     // gray-500
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all .18s ease;
}

.fade-enter-from,

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>