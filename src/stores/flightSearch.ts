import { flightSearch } from '@/api'
import type { CardRow } from '@/utils/types'
import { defineStore } from 'pinia'

export const useFlightSearchStore = defineStore('flightSearch', {
    state: () => ({
        data: [] as CardRow[],
        loading: 'default' as 'default' | 'loading' | 'success',
        error: null as string | null,
    }),
    getters: {
    },
    actions: {
        async fetchFlightSearch(req: any) {
            this.loading = 'loading'
            try {
                const res = await flightSearch(req)
                const data = res.data.data
                this.data = Array.isArray(data) ? data : []
                this.loading = 'success'
                return data
            } catch (err: any) {
                this.error = err.response?.data?.message || 'flightSearch failed'
                this.loading = 'success' // Still set to success to allow UI to show error state
                throw err
            }
        },
        reset() {
            this.data = []
            this.loading = 'default'
            this.error = null
        }
    }
})
