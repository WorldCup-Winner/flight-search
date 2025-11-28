import { getLocations, getLocationAutocomplete } from '@/api'
import type { Location } from '@/utils/types'
import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', {
    state: () => ({
        locations: [] as Location[],
        autocompleteResults: [] as any[],
        loading: false,
        error: null,
    }),
    getters: {
        locationCount(state) {
            return state.locations.length
        }
    },
    actions: {
        async fetchLocations() {
            this.loading = true
            try {
                const res = await getLocations()
                // 新 API 使用 cities 而不是 airports
                // 為了向下兼容，將 cities 也映射到 airports
                const sortedLocations = res.data.data.map((location: any) => {
                    const cities = location.cities || []
                    const sortedCities = [...cities].sort((a, b) => 
                        (a.cityDisplayOrder || 0) - (b.cityDisplayOrder || 0)
                    )
                    return {
                        ...location,
                        cities: sortedCities,
                        airports: sortedCities.map((city: any) => ({
                            ...city,
                            airportNameZh: city.cityNameZhTw // 使用城市名稱作為機場名稱
                        }))
                    }
                })
                console.log(sortedLocations)
                this.locations = sortedLocations
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Failed to load locations'
                console.log(err)
            }
            this.loading = false
        },
        async fetchLocationAutocomplete(keyword: string) {
            this.loading = true
            try {
                const res = await getLocationAutocomplete(keyword)
                this.autocompleteResults = res.data.data
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Failed to fetch autocomplete'
                console.log(err)
            }
            this.loading = false
        },
        clearAutocompleteResults() {
            this.autocompleteResults = []
        }
    }
    
})
