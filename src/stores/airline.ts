import { getAirlineAlliance, getAirlines } from '@/api'
import type { Airline, AirlineAlliance } from '@/utils/types'
import { defineStore } from 'pinia'

export const useAirlineStore = defineStore('airline', {
    state: () => ({
        airlines: [] as Airline[],
        airlineAlliance: [] as AirlineAlliance[],
        loading: false,
        error: null as string | null,
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
                this.error = err.response?.data?.message || 'getAirlines failed'
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
            }
            this.loading = false
        }
    }
})
