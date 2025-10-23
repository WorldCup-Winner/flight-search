import { booking, fareRule, flightSearch, LiyiFP04 } from '@/api'
import type { CardRow, Order, OrderResult, Sector } from '@/utils/types'
import { defineStore } from 'pinia'

export const useFlightSearchStore = defineStore('flightSearch', {
    state: () => ({
        data: [] as Array<any>,
        searchP: [] as Array<any>,
        selectedAirlines: [] as Array<Sector>,
        tripType: 0,
        fareRule: {} as Object,
        loading: 'default',
        bookingResponse: {} as Order,
        orderResult: {} as OrderResult,
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
                const res = await fareRule(req)
                this.fareRule = res.data.data
            } catch (err: any) {
                this.error = err.response?.data?.message || 'FareRule Loading failed.'
                console.log(err)
            }
        },
        async fetchOrder(req: any) {
            try {
                const res = await booking(req)
                this.bookingResponse = res.data.data
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Booking Loading failed.'
                console.log(err)
            }
        },
        async fetchOrderResult(req: any) {
            try {
                const res = await LiyiFP04(req)
                this.orderResult = res.data
            } catch (err: any) {
                this.error = err.response?.data?.message || 'LiyiFP04 Loading failed.'
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
