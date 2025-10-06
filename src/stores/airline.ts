import { getAirlines } from '@/api'
import type { Airline } from '@/utils/types'
import { defineStore } from 'pinia'

export const useAirlineStore = defineStore('airline', {
    state: () => ({
        airlines: Array<Airline>,
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
            } catch (err) {
                console.log(err)
            }
            this.loading = false
        }
    }
})
