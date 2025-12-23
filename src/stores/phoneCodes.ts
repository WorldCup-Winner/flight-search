import { getPhoneCodes } from '@/api'
import { defineStore } from 'pinia'

export interface PhoneCode {
  label: string
  value: string
}

export const usePhoneCodesStore = defineStore('phoneCodes', {
  state: () => ({
    codes: [] as PhoneCode[],
    loading: false,
    error: null as string | null,
  }),
  getters: {
    hasCodes(state) {
      return state.codes.length > 0
    }
  },
  actions: {
    async fetchPhoneCodes() {
      // If already loaded, don't fetch again
      if (this.codes.length > 0) {
        return
      }

      this.loading = true
      this.error = null
      
      try {
        const response = await getPhoneCodes()
        
        // Check API response format: { head: { code, message }, data: [...] }
        if (response.data?.head?.code === 0 && Array.isArray(response.data.data)) {
          // Transform API data to PhoneField format
          // API format: { countryCode, countryNameZh, phoneCountryCode }
          this.codes = response.data.data
            .filter((item: any) => item.phoneCountryCode) // Filter out items without phone code
            .map((item: any) => ({
              label: `${item.countryNameZh || item.countryCode || ''} (${item.phoneCountryCode})`,
              value: item.phoneCountryCode
            }))
        } else {
          throw new Error('Invalid API response format')
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to load phone codes'
        console.error('Failed to fetch phone codes:', err)
        // Set default codes as fallback
        this.codes = [
          { label: '台灣 (+886)', value: '+886' },
          { label: '香港 (+852)', value: '+852' },
          { label: '日本 (+81)', value: '+81' },
          { label: '美國/加拿大 (+1)', value: '+1' },
        ]
      } finally {
        this.loading = false
      }
    }
  }
})

