import { flightSearch } from '@/api'
import type { CardRow } from '@/utils/types'
import { defineStore } from 'pinia'

export const useFlightSearchStore = defineStore('flightSearch', {
    state: () => ({
        data: [],
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
        }
    }
})
