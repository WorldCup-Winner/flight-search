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
                <div class="space-y-6">
                    <!-- Country matches -->
                    <div
                        v-for="country in countryResults"
                        :key="'country-' + country.name"
                        class="space-y-1"
                    >
                        <div class="flex items-center gap-2 text-sm">
                            <span class="border-2 border-others-original text-others-original rounded-xl font-medium py-1 px-1 text-base leading-none transition-colors">
                                國家
                            </span>
                            <span
                                class="text-others-gray7"
                                v-html="highlightMatch(country.name)"
                            />
                        </div>
                        <div
                            v-for="airport in country.airports"
                            :key="'country-airport-' + country.name + '-' + airport.iataCode"
                            class="flex items-center gap-2 text-sm pl-10"
                        >
                            <span class="text-others-gray3">→</span>
                            <button
                                type="button"
                                class="text-left text-others-gray7 hover:text-others-original transition-colors"
                                @click="onCityClick({
                                    type: 'airport',
                                    iataCode: airport.iataCode,
                                    displayName: airport.name,
                                    countryName: country.name,
                                    cityDisplayOrder: 0
                                })"
                            >
                                <span v-html="highlightMatch(airport.name)" />
                                <span class="ml-1 text-xs text-others-gray5">{{ airport.iataCode }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- City matches -->
                    <div
                        v-for="city in cityResults"
                        :key="'city-' + city.cityName + '-' + city.countryName"
                        class="space-y-1"
                    >
                        <div class="flex items-center gap-2 text-sm">
                            <span class="border-2 border-others-original text-others-original rounded-xl font-medium py-1 px-1 text-base leading-none transition-colors">
                                城市
                            </span>
                            <button
                                type="button"
                                class="text-left text-others-gray7 hover:text-others-original transition-colors"
                                @click="onCityClick({
                                    type: 'city',
                                    iataCode: city.iataCode,
                                    displayName: city.cityName,
                                    countryName: city.countryName,
                                    cityDisplayOrder: 0
                                })"
                            >
                                <span v-html="highlightMatch(city.cityName)" />
                                <span class="ml-1 text-xs text-others-gray5">{{ city.countryName }}</span>
                            </button>
                        </div>
                        <div
                            v-for="airport in city.airports"
                            :key="'city-airport-' + city.cityName + '-' + airport.iataCode"
                            class="flex items-center gap-2 text-sm pl-10"
                        >
                            <span class="text-others-gray3">→</span>
                            <button
                                type="button"
                                class="text-left text-others-gray7 hover:text-others-original transition-colors"
                                @click="onCityClick({
                                    type: 'airport',
                                    iataCode: airport.iataCode,
                                    displayName: airport.name,
                                    countryName: city.countryName,
                                    cityName: city.cityName,
                                    cityDisplayOrder: 0
                                })"
                            >
                                <span v-html="highlightMatch(airport.name)" />
                                <span class="ml-1 text-xs text-others-gray5">{{ airport.iataCode }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Airport matches -->
                    <div v-if="airportResults.length > 0" class="flex items-start gap-2 text-sm">
                        <span class="border-2 border-others-original text-others-original rounded-xl font-medium py-1 px-1 text-base leading-none transition-colors">
                            機場
                        </span>
                        <div class="space-y-1">
                            <div
                                v-for="airport in airportResults"
                                :key="'airport-' + airport.iataCode"
                                class="flex items-center gap-2 text-sm"
                            >
                                <span class="text-others-gray3">→</span>
                                <button
                                    type="button"
                                    class="text-left text-others-gray7 hover:text-others-original transition-colors"
                                    @click="onCityClick({
                                        type: 'airport',
                                        iataCode: airport.iataCode,
                                        displayName: airport.name,
                                        cityDisplayOrder: 0
                                    })"
                                >
                                    <span v-html="highlightMatch(airport.name)" />
                                    <span class="ml-1 text-xs text-others-gray5">{{ airport.iataCode }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
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
            class="md:hidden bg-white px-6 py-5 rounded-t-[20px] sticky bottom-0 z-10"
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

// Structures for categorized search results
interface CountryResult {
    name: string
    airports: { name: string; iataCode: string }[]
}

interface CityResult {
    cityName: string
    countryName: string
    iataCode: string
    airports: { name: string; iataCode: string }[]
}

interface AirportResult {
    name: string
    iataCode: string
}

const keywordLower = computed(() => searchKeyword.value.trim().toLowerCase())

// Country-level matches: country name contains keyword, or any city/airport iataCode matches
const countryResults = computed<CountryResult[]>(() => {
    const kw = keywordLower.value
    if (!kw || !locationStore.autocompleteResults?.length) return []

    const results: CountryResult[] = []

    locationStore.autocompleteResults.forEach((country: any) => {
        const countryName = country.displayNameZh || ''
        
        // Check if country name matches
        const countryNameMatches = countryName.toLowerCase().includes(kw)
        
        // Check if any city iataCode matches
        let cityCodeMatches = false
        if (Array.isArray(country.data)) {
            cityCodeMatches = country.data.some((city: any) => 
                city.iataCode && city.iataCode.toLowerCase().includes(kw)
            )
        }
        
        // Check if any airport iataCode matches
        let airportCodeMatches = false
        if (Array.isArray(country.data)) {
            country.data.forEach((city: any) => {
                if (Array.isArray(city.data)) {
                    if (city.data.some((airport: any) => 
                        airport.iataCode && airport.iataCode.toLowerCase().includes(kw)
                    )) {
                        airportCodeMatches = true
                    }
                }
            })
        }
        
        if (!countryNameMatches && !cityCodeMatches && !airportCodeMatches) return

        const airports: { name: string; iataCode: string; cityDisplayOrder?: number }[] = []
        if (Array.isArray(country.data)) {
            country.data.forEach((city: any) => {
                if (Array.isArray(city.data)) {
                    city.data.forEach((airport: any) => {
                        if (airport.iataCode) {
                            airports.push({
                                name: airport.displayNameZh || airport.airportNameZh || '',
                                iataCode: airport.iataCode,
                                cityDisplayOrder: airport.cityDisplayOrder ?? city.cityDisplayOrder ?? 0
                            })
                        }
                    })
                }
            })
        }

        airports.sort(
            (a, b) => (a.cityDisplayOrder || 0) - (b.cityDisplayOrder || 0)
        )

        if (airports.length > 0) {
            results.push({
                name: countryName,
                airports: airports.map(a => ({ name: a.name, iataCode: a.iataCode }))
            })
        }
    })

    return results
})

// City-level matches: city name or iataCode contains keyword
const cityResults = computed<CityResult[]>(() => {
    const kw = keywordLower.value
    if (!kw || !locationStore.autocompleteResults?.length) return []

    const results: CityResult[] = []

    locationStore.autocompleteResults.forEach((country: any) => {
        const countryName = country.displayNameZh || ''

        if (Array.isArray(country.data)) {
            country.data.forEach((city: any) => {
                const cityName =
                    city.displayNameZh || city.cityNameZhTw || ''
                const cityCode = city.iataCode || ''

                // Match if city name OR city iataCode contains keyword
                if (!cityName.toLowerCase().includes(kw) && !cityCode.toLowerCase().includes(kw)) return

                const airports: { name: string; iataCode: string; cityDisplayOrder?: number }[] = []

                if (Array.isArray(city.data)) {
                    city.data.forEach((airport: any) => {
                        if (airport.iataCode) {
                            airports.push({
                                name: airport.displayNameZh || airport.airportNameZh || '',
                                iataCode: airport.iataCode,
                                cityDisplayOrder: airport.cityDisplayOrder ?? city.cityDisplayOrder ?? 0
                            })
                        }
                    })
                }

                airports.sort(
                    (a, b) => (a.cityDisplayOrder || 0) - (b.cityDisplayOrder || 0)
                )

                if (airports.length > 0) {
                    results.push({
                        cityName,
                        countryName,
                        iataCode: cityCode,
                        airports: airports.map(a => ({ name: a.name, iataCode: a.iataCode }))
                    })
                }
            })
        }
    })

    return results
})

// Airport-level matches: airport name or iataCode contains keyword
const airportResults = computed<AirportResult[]>(() => {
    const kw = keywordLower.value
    if (!kw || !locationStore.autocompleteResults?.length) return []

    const results: AirportResult[] = []

    locationStore.autocompleteResults.forEach((country: any) => {
        if (Array.isArray(country.data)) {
            country.data.forEach((city: any) => {
                if (Array.isArray(city.data)) {
                    city.data.forEach((airport: any) => {
                        const name =
                            airport.displayNameZh || airport.airportNameZh || ''
                        const airportCode = airport.iataCode || ''
                        // Match if airport name OR iataCode contains keyword
                        if (
                            airport.iataCode &&
                            (name.toLowerCase().includes(kw) || airportCode.toLowerCase().includes(kw))
                        ) {
                            results.push({
                                name,
                                iataCode: airport.iataCode
                            })
                        }
                    })
                }
            })
        }
    })

    return results
})

const hasSearchResults = computed(
    () =>
        countryResults.value.length > 0 ||
        cityResults.value.length > 0 ||
        airportResults.value.length > 0
)

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

// Highlight matched keyword in search results
function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightMatch(text: string): string {
    const keyword = searchKeyword.value.trim()
    if (!keyword) return text

    try {
        const regex = new RegExp(escapeRegExp(keyword), 'gi')
        return text.replace(
            regex,
            (match) =>
                `<span class="text-others-original">${match}</span>`
        )
    } catch {
        // Fallback: return original text if regex fails
        return text
    }
}

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
