import { flightSearch } from '@/api'
import { defineStore } from 'pinia'

export const useFlightSearchStore = defineStore('flightSearch', {
    state: () => ({
        data: null,
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
            } catch (err) {
                console.log(err)
            }
            this.loading = 'success'
        }
    }
})
