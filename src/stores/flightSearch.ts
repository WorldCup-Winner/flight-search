import { flightSearch, getFareRule } from '@/api'
import type { CardRow } from '@/utils/types'
import { defineStore } from 'pinia'

export const useFlightSearchStore = defineStore('flightSearch', {
    state: () => ({
        data: [] as Array<any>,
        searchP: [] as Array<any>,
        selectedAirlines: [] as Array<any>,
        tripType: 0,
        fareRule: null,
        loading: 'default',
        error: null,
    }),
    getters: {
    },
    actions: {
        async fetchFlightSearch(req: any) {
            this.loading = 'loading'
            try {
                const res = await flightSearch(req)
                this.data = res.data.data
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Login failed'
                console.log(err)
            }
            this.loading = 'success'
        },
        async fetchFareRule(req: any) {
            try {
                const res = await getFareRule(req)
                this.fareRule = res.data.data
            } catch (err: any) {
                this.error = err.response?.data?.message || 'FareRule Loading failed.'
                console.log(err)
            }
        },
        addAirlines(airline: any) {
            this.selectedAirlines.push(airline)
        },
        addSearchP(p: any) {
            this.searchP.push(p)
        },
        setTripType(type: any) {
            this.tripType = type
        }
    }
})
