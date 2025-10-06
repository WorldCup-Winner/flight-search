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
                this.locations = res.data.data
            } catch (err) {
                console.log(err)
            }
            this.loading = false
        }
    }
})
