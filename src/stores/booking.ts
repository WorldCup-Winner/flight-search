import { defineStore } from 'pinia'
import type { FareRuleResponse, Sector } from '@/utils/types'

// 航段資訊
export interface FlightSegment {
  refNumber: string
  sectors: Sector[]
  totalMinutes: number
  stopsCount: number
  totalPrice: number
  currency: string
  roundTripIncluded: boolean
  header: {
    departureTime: string
    arrivalTime: string
    departureAirportCode: string
    arrivalAirportCode: string
    departureTerminal?: string
    arrivalTerminal?: string
  }
}

// 訂票資訊
export interface BookingInfo {
  // 航班資訊
  outboundSegment: FlightSegment | null  // 去程航段
  returnSegment: FlightSegment | null    // 回程航段（單程時為 null）

  // 選擇的票價選項
  selectedFare: {
    id: string
    cabin: string
    price: number
    notes: any[]
  } | null

  // Fare-rule 資料
  fareRuleData: FareRuleResponse['data'] | null

  // 搜尋參數（用於顯示標題等）
  searchParams: {
    tripType: 'oneway' | 'roundtrip' | 'multi'
    departureCity: string
    arrivalCity: string
    departureCityCode: string
    arrivalCityCode: string
    departureDate: string
    returnDate?: string
    adults: number
    children: number
    infants: number
  } | null

  bookingResult: {
    bookingData: any
    itineraries: any[]
    passengers: any[]
  } | null
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingInfo => ({
    outboundSegment: null,
    returnSegment: null,
    selectedFare: null,
    fareRuleData: null,
    searchParams: null,
    bookingResult: null,
  }),

  getters: {
    // 是否為來回機票
    isRoundTrip: (state) => state.returnSegment !== null,

    // 總乘客數
    totalPassengers: (state) => {
      if (!state.searchParams) return 0
      return state.searchParams.adults + state.searchParams.children + state.searchParams.infants
    },

    // 航班摘要文字
    flightSummary: (state) => {
      if (!state.searchParams) return ''
      const { departureCity, arrivalCity } = state.searchParams
      return `${departureCity} - ${arrivalCity}`
    },
  },

  actions: {
    // 設定訂票資訊
    setBookingInfo(data: Partial<BookingInfo>) {
      Object.assign(this.$state, data)
    },

    setBookingResult(result: any) {
      this.bookingResult = result;
    },

    // 清空訂票資訊
    clearBookingInfo() {
      this.$state.outboundSegment = null
      this.$state.returnSegment = null
      this.$state.selectedFare = null
      this.$state.fareRuleData = null
      this.$state.searchParams = null
      this.$state.bookingResult = null
    },

    // 設定去程航段
    setOutboundSegment(segment: FlightSegment) {
      this.outboundSegment = segment
    },

    // 設定回程航段
    setReturnSegment(segment: FlightSegment) {
      this.returnSegment = segment
    },

    // 設定選擇的票價
    setSelectedFare(fare: any) {
      this.selectedFare = fare
    },

    // 設定 fare-rule 資料
    setFareRuleData(data: FareRuleResponse['data']) {
      this.fareRuleData = data
    },

    // 設定搜尋參數
    setSearchParams(params: any) {
      this.searchParams = params
    },
    getBookingData() {
      const stored = localStorage.getItem('BOOKING_DATA')
      if (stored) {
        const parsedData = JSON.parse(stored)
        this.$state.outboundSegment = parsedData.outboundSegment
        this.$state.returnSegment = parsedData.returnSegment
        this.$state.selectedFare = parsedData.selectedFare
        this.$state.fareRuleData = parsedData.fareRuleData
        this.$state.searchParams = parsedData.searchParams
        this.$state.bookingResult = parsedData.bookingResult
      }
    },
    clearBookingData() {
      localStorage.removeItem('BOOKING_DATA')
    }
  },
})
