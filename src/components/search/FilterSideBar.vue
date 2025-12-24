<template>
  <aside class="rounded-[10px] bg-white py-6 px-2 drop-shadow-[0px_2px_30px_rgba(0,0,0,0.1)] md:p-7 w-full">
    <!-- row: title + clear -->
    <div class="flex items-center justify-between">
      <h3 class="tracking-wide text-primary-gold font-bold">自訂篩選</h3>
      <button class="text-others-original font-bold hover:opacity-80" @click="clearAll">清除全部</button>
    </div>

    <!-- 學生航班 -->
    <!-- <div class="mt-4">
      <div class="flex items-center gap-3">
        <label class="flex items-center cursor-pointer relative">
          <input type="checkbox" checked
            class="peer w-5 h-5 cursor-pointer transition-all appearance-none rounded-none hover:shadow-md border-2 border-primary-gold checked:bg-primary-gold"
            id="check" v-model="state.studentOnly" />
          <span
            class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-primary-gold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
              stroke="currentColor" stroke-width="1">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </span>
        </label>
        <label class="cursor-pointer text-others-gray1">
          提供學生航班
        </label>
      </div>
    </div> -->

    <hr class="my-6 border-others-gray2" />

    <!-- 直飛 / 轉機 -->
    <h4 class="tracking-wide text-primary-gold font-bold">直飛/轉機</h4>
    <div class="mt-3 space-y-3">
      <div class="flex items-center gap-3">
        <label class="flex items-center cursor-pointer relative">
          <input type="checkbox"
            class="peer w-5 h-5 cursor-pointer transition-all appearance-none rounded-none shadowhover:shadow-md border-2 border-primary-gold checked:bg-primary-gold"
            id="check1" v-model="state.stops.direct" />
          <span
            class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-primary-gold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
              stroke="currentColor" stroke-width="1">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </span>
        </label>
        <label class="cursor-pointer text-others-gray1">
          直飛
        </label>
        <label v-if="stopsPricing?.direct" class="ml-auto text-others-gray1">{{ formatCurrency(stopsPricing.direct) }}</label>
      </div>

      <div class="flex items-center gap-3">
        <label class="flex items-center cursor-pointer relative">
          <input type="checkbox"
            class="peer w-5 h-5 cursor-pointer transition-all appearance-none rounded-none shadowhover:shadow-md border-2 border-primary-gold checked:bg-primary-gold"
            id="check2" v-model="state.stops.oneStop" />
          <span
            class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-primary-gold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
              stroke="currentColor" stroke-width="1">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </span>
        </label>
        <label class="cursor-pointer text-others-gray1">
          轉機 / 中停1次
        </label>
        <label v-if="stopsPricing?.oneStop" class="ml-auto text-others-gray1">{{ formatCurrency(stopsPricing.oneStop) }}</label>
      </div>
    </div>

    <hr class="my-6 border-others-gray2" />

    <!-- 航空公司（聯盟卡片） -->
    <h4 class="tracking-wide text-primary-gold font-bold">航空公司</h4>
    
    <!-- Alliance Cards: Mobile (horizontal, full width) / Desktop (vertical, attached) -->
    <div class="mt-4 grid grid-cols-3 gap-3 md:flex md:flex-col md:gap-0 md:space-y-0 md:rounded-[10px] md:overflow-hidden">
      <button
        v-for="(alliance, index) in props.alliances"
        :key="alliance.id"
        type="button"
        @click="toggleAllianceWithAirlines(alliance.id)"
        class="flex items-center gap-4 w-full bg-white px-4 py-3 text-left hover:bg-others-gray9 transition-colors border-2 rounded-[10px] md:rounded-none md:border-x md:border-b"
        :class="[
          isAllianceSelected(alliance.id) 
            ? 'bg-[#FFF6DD] border-others-original' 
            : 'border-others-gray2',
          index === 0 ? 'md:border-t md:rounded-t-[10px]' : '',
          index === props.alliances.length - 1 ? 'md:rounded-b-[10px]' : ''
        ]"
      >
        <img 
          :src="getAllianceLogoUrl(alliance.nameZh)" 
          :alt="alliance.nameZh" 
          class="w-14 h-14 object-contain flex-shrink-0"
          @error="handleImageError"
        />
        <div class="flex-1 min-w-0">
          <div class="text-others-gray1 font-medium truncate">{{ alliance.nameZh }}</div>
        </div>
      </button>
    </div>
    
    <!-- 航空公司清單 (可展開) -->
    <div class="mt-5 space-y-3">
      <div v-for="air in visibleAirlines" :key="air.id" class="flex items-center gap-3">
        <label class="flex items-center cursor-pointer relative">
          <input type="checkbox"
            class="peer w-5 h-5 cursor-pointer transition-all appearance-none rounded-none shadowhover:shadow-md border-2 border-primary-gold checked:bg-primary-gold"
            :id="air.id" v-model="airlinesModel[air.id]" />
          <span
            class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-primary-gold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
              stroke="currentColor" stroke-width="1">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </span>
        </label>
        <label class="cursor-pointer text-others-gray1">
          {{ air.name }}
        </label>
        <label v-if="air.price" class="ml-auto text-others-gray1">{{ formatCurrency(air.price) }}</label>
      </div>
      <button v-if="airlines.length > airlineLimit"
        class="ml-auto block text-others-original font-bold hover:opacity-80"
        @click="showMoreAirlines = !showMoreAirlines">
        {{ showMoreAirlines ? '收起' : '顯示更多' }}
        <span class="inline-block align-middle" :class="showMoreAirlines ? 'rotate-180' : ''">▾</span>
      </button>
    </div>

    <hr class="my-6 border-others-gray2" />

    <!-- 起飛機場 -->
    <h4 class="tracking-wide text-primary-gold font-bold">起飛機場</h4>
    <div class="mt-4 space-y-3">
      <div v-for="a in visibleDepAirports" :key="a.id" class="flex items-center gap-3">
        <label class="flex items-center cursor-pointer relative">
          <input type="checkbox"
            class="peer w-5 h-5 cursor-pointer transition-all appearance-none rounded-none shadowhover:shadow-md border-2 border-primary-gold checked:bg-primary-gold"
            :d="a.id" v-model="depAirportsModel[a.id]" />
          <span
            class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-primary-gold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
              stroke="currentColor" stroke-width="1">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </span>
        </label>
        <label class="cursor-pointer text-others-gray1">
          {{ a.name }}
        </label>
        <label v-if="a.price" class="ml-auto text-others-gray1">
          {{ formatCurrency(a.price) }}
        </label>
      </div>

      <button v-if="depAirports.length > airportLimit"
        class="ml-auto block text-others-original font-bold hover:opacity-80"
        @click="showMoreDepAirports = !showMoreDepAirports">
        顯示更多 <span class="inline-block" :class="showMoreDepAirports ? 'rotate-180' : ''">▾</span>
      </button>
    </div>

    <hr class="my-6 border-others-gray2" />

    <!-- 到達機場 -->
    <h4 class="tracking-wide text-primary-gold font-bold">到達機場</h4>
    <div class="mt-4 space-y-3">

      <div v-for="a in visibleArrAirports" :key="a.id" class="flex items-center gap-3">
        <label class="flex items-center cursor-pointer relative">
          <input type="checkbox"
            class="peer w-5 h-5 cursor-pointer transition-all appearance-none rounded-none shadowhover:shadow-md border-2 border-primary-gold checked:bg-primary-gold"
            :id="a.id" v-model="arrAirportsModel[a.id]" />
          <span
            class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-primary-gold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
              stroke="currentColor" stroke-width="1">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </span>
        </label>
        <label class="cursor-pointer text-others-gray1">
          {{ a.name }}
        </label>
        <label v-if="a.price" class="ml-auto text-others-gray1">{{ formatCurrency(a.price) }}</label>
      </div>

    </div>

    <hr class="my-6 border-others-gray2" />

    <!-- 起飛時間 -->
    <h4 class="tracking-wide text-primary-gold font-bold">起飛時間</h4>
    <div class="mt-2 text-others-gray1 font-medium">
      {{ minutesToText(state.departTime[0]) }} - {{ minutesToText(state.departTime[1]) }}
    </div>
    <div class="relative h-8 mt-1" :style="getDualRangeStyle(state.departTime[0], state.departTime[1])">
      <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[6px] rounded-full bg-others-gray3"></div>
      <div class="absolute top-1/2 -translate-y-1/2 h-[6px] rounded-full bg-others-original"
        :style="{ left: 'var(--start)', right: 'calc(100% - var(--end))' }"></div>
      <input type="range" :min="0" :max="1439" :step="5" :value="state.departTime[0]" @input="updateDepartStart"
        class="range-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto" />
      <input type="range" :min="0" :max="1439" :step="5" :value="state.departTime[1]" @input="updateDepartEnd"
        class="range-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto" />
    </div>

    <!-- 到達時間 -->
    <h4 class="mt-6 tracking-wide text-primary-gold font-bold">到達時間</h4>
    <div class="mt-2 text-others-gray1 font-medium">
      {{ minutesToText(state.arriveTime[0]) }} - {{ minutesToText(state.arriveTime[1]) }}
    </div>
    <div class="relative h-8 mt-1" :style="getDualRangeStyle(state.arriveTime[0], state.arriveTime[1])">
      <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[6px] rounded-full bg-others-gray3"></div>
      <div class="absolute top-1/2 -translate-y-1/2 h-[6px] rounded-full bg-others-original"
        :style="{ left: 'var(--start)', right: 'calc(100% - var(--end))' }"></div>
      <input type="range" :min="0" :max="1439" :step="5" :value="state.arriveTime[0]" @input="updateArriveStart"
        class="range-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto" />
      <input type="range" :min="0" :max="1439" :step="5" :value="state.arriveTime[1]" @input="updateArriveEnd"
        class="range-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { minutesToText, formatCurrency, getDualRangeStyle, getAllianceLogoUrl } from '@/utils';
import type { AirlineAlliance } from '@/utils/types';

/** ---------- Props ---------- */
type Row = { id: string; name: string; price?: number }

const props = defineProps<{
  stopsPricing?: { direct?: number; oneStop?: number }
  alliances: AirlineAlliance[]
  airlines: Row[]
  depAirports: Row[]
  arrAirports: Row[]
  /** initial state (optional) */
  initial?: Partial<{
    studentOnly: boolean
    stops: { direct: boolean; oneStop: boolean }
    alliances: string[]
    airlines: string[]
    depAirports: string[]
    arrAirports: string[]
    departTime: [number, number]
    arriveTime: [number, number]
  }>
  /** When true, don't emit on every change - wait for explicit confirm */
  confirmMode?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:filters', v: any): void
  (e: 'confirm', v: any): void
}>()

// Expose confirm method and getCurrentFilters for parent to call
defineExpose({
  confirm: () => {
    const filters = getCurrentFilters()
    emit('confirm', filters)
  },
  getCurrentFilters
})

/** ---------- State ---------- */
const state = reactive({
  studentOnly: props.initial?.studentOnly ?? false,
  stops: { direct: props.initial?.stops?.direct ?? false, oneStop: props.initial?.stops?.oneStop ?? false },
  alliances: new Set<string>(props.initial?.alliances ?? []),
  airlines: new Set<string>(props.initial?.airlines ?? []),
  depAirports: new Set<string>(props.initial?.depAirports ?? []),
  arrAirports: new Set<string>(props.initial?.arrAirports ?? []),
  departTime: (props.initial?.departTime ?? [0, 1439]) as [number, number],
  arriveTime: (props.initial?.arriveTime ?? [0, 1439]) as [number, number],
})

/** ---------- “顯示更多” handling ---------- */
const airlineLimit = 4
const airportLimit = 2
const showMoreAirlines = ref(false)
const showMoreDepAirports = ref(false)
const visibleAirlines = computed(() =>
  showMoreAirlines.value ? props.airlines : props.airlines.slice(0, airlineLimit)
)
console.log(props.airlines)
const visibleDepAirports = computed(() =>
  showMoreDepAirports.value ? props.depAirports : props.depAirports.slice(0, airportLimit)
)
const visibleArrAirports = computed(() => props.arrAirports) // screenshot shows only 1-2 rows; no toggle in last image

/** ---------- Models for checkbox lists ---------- */
const airlinesModel = reactive<Record<string, boolean>>({})
const depAirportsModel = reactive<Record<string, boolean>>({})
const arrAirportsModel = reactive<Record<string, boolean>>({})

// Initialize models from props and initial state
function initializeModels() {
  // Initialize airlines model
  props.airlines.forEach(airline => {
    airlinesModel[airline.id] = state.airlines.has(airline.id)
  })
  
  // Initialize airports models
  props.depAirports.forEach(airport => {
    depAirportsModel[airport.id] = state.depAirports.has(airport.id)
  })
  
  props.arrAirports.forEach(airport => {
    arrAirportsModel[airport.id] = state.arrAirports.has(airport.id)
  })
}

// Initialize on mount and when props change
initializeModels()
watch(() => props.airlines, () => {
  // Update airlinesModel when props.airlines changes (new airlines added)
  props.airlines.forEach(airline => {
    if (!(airline.id in airlinesModel)) {
      airlinesModel[airline.id] = state.airlines.has(airline.id)
    }
  })
}, { deep: true })

/** ---------- Alliance-Airline Two-Way Binding Helpers ---------- */
// Get all IATA codes for airlines in an alliance that exist in props.airlines
function getRelevantAirlinesForAlliance(allianceId: string): string[] {
  const alliance = props.alliances.find(a => a.id === allianceId)
  if (!alliance) return []
  
  const availableAirlineIds = new Set(props.airlines.map(a => a.id))
  return alliance.airlines
    .map(airline => airline.iataCode)
    .filter(code => code && availableAirlineIds.has(code))
}

// Check if all relevant airlines of an alliance are selected
function isAllianceFullySelected(allianceId: string): boolean {
  const relevantIataCodes = getRelevantAirlinesForAlliance(allianceId)
  if (relevantIataCodes.length === 0) return false
  
  return relevantIataCodes.every(code => state.airlines.has(code))
}

// Check if alliance should appear selected (for UI)
function isAllianceSelected(allianceId: string): boolean {
  return state.alliances.has(allianceId) || isAllianceFullySelected(allianceId)
}

// Update alliance state based on current airline selections (called from watch)
function syncAllianceStateFromAirlines() {
  props.alliances.forEach(alliance => {
    if (isAllianceFullySelected(alliance.id)) {
      state.alliances.add(alliance.id)
    } else {
      state.alliances.delete(alliance.id)
    }
  })
}

// Watch for airline checkbox changes and sync state
watch(airlinesModel, () => {
  // Update state.airlines from airlinesModel
  state.airlines = new Set(Object.keys(airlinesModel).filter(k => airlinesModel[k]))
  
  // Sync alliance state based on airline selections
  syncAllianceStateFromAirlines()
  
  if (!props.confirmMode) {
    push()
  }
}, { deep: true })
watch(depAirportsModel, () => {
  state.depAirports = new Set(Object.keys(depAirportsModel).filter(k => depAirportsModel[k]))
  if (!props.confirmMode) {
    push()
  }
}, { deep: true })
watch(arrAirportsModel, () => {
  state.arrAirports = new Set(Object.keys(arrAirportsModel).filter(k => arrAirportsModel[k]))
  if (!props.confirmMode) {
    push()
  }
}, { deep: true })

/** ---------- Alliance Interactions ---------- */
// Toggle alliance: select/deselect all its airlines
function toggleAllianceWithAirlines(allianceId: string) {
  const relevantIataCodes = getRelevantAirlinesForAlliance(allianceId)
  if (relevantIataCodes.length === 0) return
  
  // Determine current state: if all are selected, we'll deselect; otherwise select
  const allSelected = relevantIataCodes.every(code => state.airlines.has(code))
  const shouldSelect = !allSelected
  
  // Update airline checkboxes (this will trigger the watch which updates state)
  relevantIataCodes.forEach(iataCode => {
    if (iataCode in airlinesModel) {
      airlinesModel[iataCode] = shouldSelect
    }
  })
  
  // Note: state.airlines and state.alliances will be updated by the watch
  // No need to manually update here - the watch handles it
}

// Legacy function (kept for compatibility)
function toggleAlliance(id: string) {
  toggleAllianceWithAirlines(id)
}

// Handle image load error
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

function clearAll() {
  state.studentOnly = false
  state.stops.direct = false
  state.stops.oneStop = false
  state.alliances.clear()
  state.airlines.clear()
  state.depAirports.clear()
  state.arrAirports.clear()
  Object.keys(airlinesModel).forEach(k => (airlinesModel[k] = false))
  Object.keys(depAirportsModel).forEach(k => (depAirportsModel[k] = false))
  Object.keys(arrAirportsModel).forEach(k => (arrAirportsModel[k] = false))
  state.departTime = [0, 1439]
  state.arriveTime = [0, 1439]
  if (!props.confirmMode) {
    push()
  }
}

/** ---------- Emit ---------- */
function getCurrentFilters() {
  return {
    studentOnly: state.studentOnly,
    stops: { ...state.stops },
    alliances: Array.from(state.alliances),
    airlines: Array.from(state.airlines),
    depAirports: Array.from(state.depAirports),
    arrAirports: Array.from(state.arrAirports),
    departTime: [...state.departTime],
    arriveTime: [...state.arriveTime],
  }
}

function push() {
  const filters = getCurrentFilters()
  emit('update:filters', filters)
}

// Only auto-emit if not in confirm mode
watch(() => [state.studentOnly, state.stops.direct, state.stops.oneStop, state.departTime[0], state.departTime[1], state.arriveTime[0], state.arriveTime[1]], () => {
  if (!props.confirmMode) {
    push()
  }
}, { deep: true })

function updateDepartStart(ev: any) {
  const next = Math.min(Number(ev.target.value), state.departTime[1] - 5)
  state.departTime[0] = next
}

function updateDepartEnd(ev: any) {
  const next = Math.max(Number(ev.target.value), state.departTime[0] + 5)
  state.departTime[1] = next
}

function updateArriveStart(ev: any) {
  const next = Math.min(Number(ev.target.value), state.arriveTime[1] - 5)
  state.arriveTime[0] = next
}

function updateArriveEnd(ev: any) {
  const next = Math.max(Number(ev.target.value), state.arriveTime[0] + 5)
  state.arriveTime[1] = next
}
</script>

<style scoped>
/* custom thumbs */
.range-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: white;
  border: 2px solid #F39800;
  cursor: pointer;
}

.range-thumb::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background: white;
  border: 2px solid #F39800;
  cursor: pointer;
}

.range-thumb {
  pointer-events: none;
}

.range-thumb::-webkit-slider-thumb {
  pointer-events: auto;
}

.range-thumb::-moz-range-thumb {
  pointer-events: auto;
}
</style>