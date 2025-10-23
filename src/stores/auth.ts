import { defineStore } from 'pinia'
import { sendSMS, signIn } from '@/api'
import { useToast } from 'vue-toastification'
import type { Pax, Sector } from '@/utils/types'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        name: localStorage.getItem('name') || null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.name,
    },

    actions: {
        async login(req: any) {
            const toast = useToast()
            this.loading = true
            this.error = null

            try {
                const { data } = await signIn(req)
                console.log(data)

                if (data.status == '1') localStorage.setItem('name', data.RET03), this.name = data.RET03
                if (data.status == '1') toast.success(`${data.msg}`)
                else if (data.status == '0') toast.warning(`${data.msg}`)
            } catch (err: any) {
                this.error = err.response?.data?.message || 'Login failed'
                toast.error(this.error)
                console.log(err)
            } finally {
                this.loading = false
            }
        },
        async sendSMS(req: any) {
            this.loading = true
            this.error = null

            try {
                const { data } = await sendSMS(req)
                console.log(data)

            } catch (err: any) {
                this.error = err.response?.data?.message || 'Sending SMS failed'
                console.log(err)
            } finally {
                this.loading = false
            }
        },
        logout() {
            this.name = null
            localStorage.removeItem('name')
        }
    },
})
