<template>
    <div
        class="shadow-2xl flex flex-col bg-white rounded-t-3xl md:rounded-2xl
               w-full md:w-[450px] md:max-w-[85vw]"
        :class="hasSearchResults ? 'max-h-[60vh] md:max-h-none' : ''"
    >
        <!-- Header -->
        <div
            class="bg-primary-gold text-white px-6 py-3 text-[18px] font-semibold flex items-center justify-between
                   sticky top-0 z-20 rounded-t-3xl md:rounded-t-2xl"
        >
            <span>航空公司搜尋</span>
            <button
                class="md:hidden text-white hover:opacity-80 transition"
                @click="onClose"
                aria-label="關閉"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Content -->
        <div class="overflow-y-auto p-4 md:p-6">
            <!-- Search Input -->
            <div class="mb-4 md:mb-6">
                <input
                    v-model="searchTerm"
                    type="text"
                    placeholder="輸入航空公司名稱 / 代碼"
                    class="w-full px-4 py-3 border-2 border-primary-gold rounded-xl text-others-gray1 placeholder-others-gray5 focus:outline-none focus:ring-2 focus:ring-others-original focus:border-transparent"
                />
            </div>

            <!-- Search Results -->
            <div
                v-if="searchTerm.trim() && filteredAirlines.length > 0"
                class="space-y-0 max-h-60 overflow-y-auto leading-relaxed text-gray-700
                       [&::-webkit-scrollbar]:w-[6px]
                       [&::-webkit-scrollbar-track]:bg-others-gray8
                       [&::-webkit-scrollbar-thumb]:bg-others-original
                       [&::-webkit-scrollbar-thumb]:rounded-[10px]"
            >
                <button
                    v-for="airline in filteredAirlines"
                    :key="airline.iataCode"
                    class="w-full text-left px-4 py-2 rounded-lg hover:bg-others-gray9 transition-colors"
                    @click="onAirlineClick(airline)"
                >
                    <div class="flex items-center">
                        <span class="text-others-gray1 mr-2">{{ airline.iataCode }}</span>
                        <span class="text-others-gray1">{{ airline.nameZhTw }}</span>
                    </div>
                </button>
            </div>

            <!-- Popular Airlines (when no search) -->
            <div v-else-if="!searchTerm.trim()">
                <h4 class="text-primary-gold font-semibold mb-4 pl-1">熱門航空公司</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <button
                        v-for="airline in popularAirlines"
                        :key="airline.iataCode"
                        class="text-left px-3 py-2 rounded-lg transition-colors text-sm md:text-base"
                        :class="[
                            localSelectedAirline?.iataCode === airline.iataCode
                                ? 'text-others-original bg-others-gray9 md:bg-transparent'
                                : 'text-others-gray1 hover:text-others-original'
                        ]"
                        @click="onAirlineClick(airline)"
                    >
                        {{ airline.nameZhTw }}
                    </button>
                </div>
            </div>

            <!-- No Results -->
            <div
                v-else-if="searchTerm.trim() && filteredAirlines.length === 0"
                class="text-center py-4 text-primary-gold"
            >
                找不到相關航空公司
            </div>
        </div>

        <!-- Footer: Mobile only -->
        <div
            class="md:hidden bg-white px-6 py-5 sticky bottom-0 z-10"
            style="box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);"
        >
            <button
                class="w-full py-3 rounded-xl font-bold text-white transition"
                :class="localSelectedAirline ? 'bg-others-original hover:bg-others-hover' : 'bg-gray-300 cursor-not-allowed'"
                :disabled="!localSelectedAirline"
                @click="onConfirm"
            >
                確認
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Airline } from '@/utils/types'

const props = defineProps<{
    airlines: Airline[]
    selectedAirline?: Airline | null
}>()

const emit = defineEmits<{
    (e: 'select', airline: Airline): void
    (e: 'close'): void
}>()

// Local state
const searchTerm = ref('')
const localSelectedAirline = ref<Airline | null>(props.selectedAirline || null)

// Sync with props
watch(() => props.selectedAirline, (val) => {
    localSelectedAirline.value = val || null
})

// Popular airlines (specific 6 airlines in order)
const popularAirlines = computed(() => {
    // Define the order of popular airlines
    const popularAirlineNames = [
        '長榮航空',
        '中華航空',
        '星宇航空',
        '日本航空',
        '阿聯酋航空',
        '紐西蘭航空'
    ]
    
    // Find airlines in the specified order
    const orderedAirlines: Airline[] = []
    for (const name of popularAirlineNames) {
        const airline = props.airlines.find(a => a.nameZhTw === name)
        if (airline) {
            orderedAirlines.push(airline)
        }
    }
    
    // If we found all 6, return them; otherwise, fill with first available airlines
    if (orderedAirlines.length === 6) {
        return orderedAirlines
    }
    
    // Fallback: add remaining airlines from the list (excluding already added ones)
    const addedCodes = new Set(orderedAirlines.map(a => a.iataCode))
    for (const airline of props.airlines) {
        if (orderedAirlines.length >= 6) break
        if (!addedCodes.has(airline.iataCode)) {
            orderedAirlines.push(airline)
            addedCodes.add(airline.iataCode)
        }
    }
    
    return orderedAirlines
})

// Filtered airlines based on search
const filteredAirlines = computed(() => {
    const term = searchTerm.value.trim().toLowerCase()
    if (!term) return []
    
    return props.airlines.filter(airline => 
        airline.iataCode?.toLowerCase().includes(term) ||
        airline.nameZhTw?.toLowerCase().includes(term) ||
        airline.nameEnUs?.toLowerCase().includes(term)
    )
})

// Check if we have search results (for dynamic height)
const hasSearchResults = computed(() => 
    searchTerm.value.trim() && filteredAirlines.value.length > 0
)

// Check if we're on mobile
function isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
}

function onAirlineClick(airline: Airline) {
    localSelectedAirline.value = airline
    
    // Desktop: auto-close on selection
    if (!isMobile()) {
        emit('select', airline)
        emit('close')
    }
}

function onConfirm() {
    if (localSelectedAirline.value) {
        emit('select', localSelectedAirline.value)
        emit('close')
    }
}

function onClose() {
    emit('close')
}
</script>

