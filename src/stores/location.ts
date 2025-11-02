import { getLocations } from '@/api'
import type { Location } from '@/utils/types'
import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', {
    state: () => ({
        locations: Array<Location>,
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
                // Sort locations and airports by cityDisplayOrder
                this.locations = res.data.data.map((location: any) => ({
                    ...location,
                    airports: [...(location.airports || [])].sort((a: any, b: any) => {
                        const orderA = a.cityDisplayOrder ?? 9999
                        const orderB = b.cityDisplayOrder ?? 9999
                        return orderA - orderB
                    })
                }))
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Login failed'
                console.log(err)
            }
            this.loading = false
        }
    }
})
