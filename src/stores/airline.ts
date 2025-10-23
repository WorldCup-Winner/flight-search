import { getAirlineAlliance, getAirlines } from '@/api'
import { defineStore } from 'pinia'

export const useAirlineStore = defineStore('airline', {
    state: () => ({
        airlines: [],
        airlineAlliance: [],
        loading: false,
        error: null,
    }),
    getters: {
        airlineCount(state) {
            return state.airlines.length
        }
    },
    actions: {
        async fetchAirlines() {
            this.loading = true
            try {
                const res = await getAirlines()
                this.airlines = res.data.data
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Login failed'
                console.log(err)
            }
            this.loading = false
        },
        async fetchAirlineAlliance() {
            this.loading = true
            try {
                const res = await getAirlineAlliance()
                if (res.data.code == 0) {
                    this.airlineAlliance = res.data.data
                }
            } catch (err: any) {
                this.error = err.response?.data?.message || 'AirlineAlliance Loading failed.'
                console.log(err)
            }
        }
    }
})
