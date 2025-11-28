<template>
    <div
        class="shadow-2xl flex flex-col bg-white
               w-full h-[50vh] rounded-t-3xl
               md:w-[750px] md:max-w-[85vw] md:h-auto md:rounded-2xl"
    >
        <!-- Header -->
        <div
            class="bg-primary-gold text-white px-6 py-3 text-[18px] font-semibold flex items-center justify-between
                   sticky top-0 z-20 rounded-t-3xl md:rounded-t-2xl"
        >
            <span>{{ title }}</span>
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

        <!-- Search Input -->
        <div class="px-4 py-3 border-b border-gray-200">
            <input
                type="text"
                v-model="searchKeyword"
                :placeholder="searchPlaceholder || '輸入國家/城市/機場關鍵字'"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-gold"
                @input="handleSearchInput"
            />
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8 text-others-gray5">
                載入中...
            </div>

            <!-- Search Results (when searching) -->
            <template v-else-if="searchKeyword.trim() && hasSearchResults">
                <div class="grid grid-cols-3 md:grid-cols-7 gap-2 md:gap-0 md:gap-y-5">
                    <button
                        v-for="item in flattenedSearchResults"
                        :key="`${item.type}-${item.iataCode}`"
                        class="px-2 py-1.5 rounded-lg md:rounded-none text-sm text-center transition-colors
                               border border-gray-200 md:border-0"
                        :class="[
                            localSelectedCity?.iataCode === item.iataCode
                                ? 'text-others-original bg-others-gray9 md:bg-transparent'
                                : 'text-others-gray1 hover:text-others-original'
                        ]"
                        @click="onCityClick(item)"
                    >
                        {{ item.displayName }}
                        <span v-if="item.type === 'airport' && item.cityName" class="block text-xs opacity-75">
                            ({{ item.cityName }})
                        </span>
                    </button>
                </div>
            </template>

            <!-- No Search Results -->
            <div v-else-if="searchKeyword.trim() && !hasSearchResults && !loading" class="text-center py-8 text-others-gray5">
                無搜尋結果
            </div>

            <!-- Region Tabs and Cities (when not searching) -->
            <template v-else-if="!searchKeyword.trim()">
                <!-- Region Tabs -->
                <div class="flex flex-wrap gap-1 mb-6">
                    <button
                        v-for="location in locations"
                        :key="location.region"
                        class="rounded-xl font-medium py-2 px-3 text-base md:text-[18px] leading-none transition-colors"
                        :class="[
                            selectedLocation?.region === location.region
                                ? 'border-2 border-others-original text-others-original'
                                : 'text-others-gray1 hover:text-others-original'
                        ]"
                        @click="selectedLocation = location"
                    >
                        {{ location.region }}
                    </button>
                </div>

                <!-- City/Airport Grid -->
                <div class="grid grid-cols-3 md:grid-cols-7 gap-2 md:gap-0 md:gap-y-5">
                    <button
                        v-for="airport in selectedLocation?.airports"
                        :key="airport.iataCode"
                        class="px-2 py-1.5 rounded-lg md:rounded-none text-sm md:text-[17px] text-center transition-colors
                               border border-gray-200 md:border-0"
                        :class="[
                            localSelectedCity?.iataCode === airport.iataCode
                                ? 'text-others-original bg-others-gray9 md:bg-transparent'
                                : 'text-others-gray1 hover:text-others-original'
                        ]"
                        @click="onCityClick(airport)"
                    >
                        {{ airport.cityNameZhTw }}
                    </button>
                </div>
            </template>
        </div>

        <!-- Footer: Mobile only -->
        <div
            class="md:hidden bg-white px-6 py-5 sticky bottom-0 z-10"
            style="box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);"
        >
            <button
                class="w-full py-3 rounded-xl font-bold text-white transition"
                :class="localSelectedCity ? 'bg-others-original hover:bg-others-hover' : 'bg-gray-300 cursor-not-allowed'"
                :disabled="!localSelectedCity"
                @click="onConfirm"
            >
                確認
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocationStore } from '@/stores/location'
import type { Location } from '@/utils/types'

interface Airport {
    iataCode: string
    cityNameZhTw: string
    airportNameZh?: string
    cityDisplayOrder?: number
}

interface AutocompleteItem {
    type: 'country' | 'city' | 'airport'
    iataCode: string
    displayName: string
    countryName?: string
    cityName?: string
    cityDisplayOrder: number
}

const props = defineProps<{
    title: string
    locations: Location[]
    selectedCity?: Airport | null
    searchPlaceholder?: string
}>()

const emit = defineEmits<{
    (e: 'select', city: Airport): void
    (e: 'close'): void
    (e: 'search', keyword: string): void
    (e: 'clear'): void
}>()

const locationStore = useLocationStore()

// Local state
const selectedLocation = ref<Location | null>(props.locations[0] || null)
const localSelectedCity = ref<Airport | null>(props.selectedCity || null)
const searchKeyword = ref('')

// Debounce search input
let searchTimeout: ReturnType<typeof setTimeout>
const handleSearchInput = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        const trimmed = searchKeyword.value.trim()
        if (trimmed) {
            locationStore.fetchLocationAutocomplete(trimmed)
        } else {
            locationStore.clearAutocompleteResults()
        }
    }, 300)
}

// Flatten autocomplete results for display
const flattenedSearchResults = computed<AutocompleteItem[]>(() => {
    if (!locationStore.autocompleteResults || locationStore.autocompleteResults.length === 0) {
        return []
    }

    const results: AutocompleteItem[] = []
    
    locationStore.autocompleteResults.forEach((country: any) => {
        if (country.data) {
            country.data.forEach((city: any) => {
                // Add city (only if it has an iataCode, skip country-level items)
                if (city.iataCode) {
                    results.push({
                        type: 'city',
                        iataCode: city.iataCode,
                        displayName: city.displayNameZh || city.cityNameZhTw || '',
                        countryName: country.displayNameZh,
                        cityDisplayOrder: city.cityDisplayOrder || 0
                    })
                }
                
                // Add airports under this city
                if (city.data && Array.isArray(city.data)) {
                    city.data.forEach((airport: any) => {
                        if (airport.iataCode) {
                            results.push({
                                type: 'airport',
                                iataCode: airport.iataCode,
                                displayName: airport.displayNameZh || airport.airportNameZh || '',
                                countryName: country.displayNameZh,
                                cityName: city.displayNameZh || city.cityNameZhTw,
                                cityDisplayOrder: airport.cityDisplayOrder || city.cityDisplayOrder || 0
                            })
                        }
                    })
                }
            })
        }
    })
    
    // Sort by cityDisplayOrder
    return results.sort((a, b) => (a.cityDisplayOrder || 0) - (b.cityDisplayOrder || 0))
})

const hasSearchResults = computed(() => flattenedSearchResults.value.length > 0)

const loading = computed(() => locationStore.loading)

// Sync with props
watch(() => props.selectedCity, (val) => {
    localSelectedCity.value = val || null
})

watch(() => props.locations, (val) => {
    if (val.length > 0 && !selectedLocation.value) {
        selectedLocation.value = val[0]
    }
})

// Clear search when component closes
watch(() => searchKeyword.value, (newVal) => {
    if (!newVal.trim()) {
        locationStore.clearAutocompleteResults()
    }
})

// Check if we're on mobile
function isMobile(): boolean {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
}

function onCityClick(item: Airport | AutocompleteItem) {
    // Convert AutocompleteItem to Airport format if needed
    const airport: Airport = {
        iataCode: item.iataCode,
        cityNameZhTw: 'displayName' in item ? item.displayName : item.cityNameZhTw,
        airportNameZh: 'airportNameZh' in item ? item.airportNameZh : undefined,
        cityDisplayOrder: item.cityDisplayOrder
    }
    
    localSelectedCity.value = airport
    
    // Desktop: auto-close on selection
    if (!isMobile()) {
        emit('select', airport)
        emit('close')
    }
}

function onConfirm() {
    if (localSelectedCity.value) {
        emit('select', localSelectedCity.value)
        emit('close')
    }
}

function onClose() {
    searchKeyword.value = ''
    locationStore.clearAutocompleteResults()
    emit('close')
    emit('clear')
}
</script>
