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
  segments: FlightSegment[],
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
    segments: [],
    outboundSegment: null,
    returnSegment: null,
    selectedFare: null,
    fareRuleData: null,
    searchParams: null,
    bookingResult: null,
  }),

  getters: {
    // 行程類型
    tripType: (state) => state.searchParams?.tripType || 'oneway',

    // 是否為來回機票
    isRoundTrip: (state) => state.searchParams?.tripType === 'roundtrip' || state.segments.length === 2,

    // 是否為多行程
    isMultiTrip: (state) => state.searchParams?.tripType === 'multi' || state.segments.length > 2,

    // 航段數量
    segmentCount: (state) => state.segments.length,

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

    // 取得第一段（去程）
    firstSegment: (state) => state.segments[0] || null,

    // 取得最後一段（回程/最後行程）
    lastSegment: (state) => state.segments[state.segments.length - 1] || null,

    // 取得所有航段的總價
    totalPrice: (state) => {
      return state.segments.reduce((sum, segment) => sum + (segment.totalPrice || 0), 0)
    },

    // 向後相容：取得去程航段
    outboundSegmentCompat: (state) => state.segments[0] || null,

    // 向後相容：取得回程航段
    returnSegmentCompat: (state) => state.segments[1] || null,
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
      this.$state.segments = []
      this.$state.outboundSegment = null
      this.$state.returnSegment = null
      this.$state.selectedFare = null
      this.$state.fareRuleData = null
      this.$state.searchParams = null
      this.$state.bookingResult = null
    },

    addSegment(segment: FlightSegment) {
      this.segments.push(segment)

      if (this.segments.length === 1) {
        this.outboundSegment = segment
      } else if (this.segments.length === 2) {
        this.returnSegment = segment
      }
    },

    setSegment(index: number, segment: FlightSegment) {
      if (index >= 0 && index < this.segments.length) {
        this.segments[index] = segment

        // 向後相容：同步更新舊欄位
        if (index === 0) this.outboundSegment = segment
        if (index === 1) this.returnSegment = segment
      }
    },

    setSegments(segments: FlightSegment[]) {
      this.segments = [...segments]

      // 向後相容：同步更新舊欄位
      this.outboundSegment = segments[0] || null
      this.returnSegment = segments[1] || null
    },

    removeSegment(index: number) {
      if (index >= 0 && index < this.segments.length) {
        this.segments.splice(index, 1)

        // 向後相容：同步更新舊欄位
        this.outboundSegment = this.segments[0] || null
        this.returnSegment = this.segments[1] || null
      }
    },

    getSegment(index: number): FlightSegment | null {
      return this.segments[index] || null
    },

    // 設定去程航段（向後相容）
    setOutboundSegment(segment: FlightSegment) {
      if (this.segments.length === 0) {
        this.segments.push(segment)
      } else {
        this.segments[0] = segment
      }
      this.outboundSegment = segment
    },

    // 設定回程航段（向後相容）
    setReturnSegment(segment: FlightSegment) {
      if (this.segments.length === 0) {
        this.segments.push({} as FlightSegment)
      }
      if (this.segments.length === 1) {
        this.segments.push(segment)
      } else {
        this.segments[1] = segment
      }
      this.returnSegment = segment
    },

    // 新增：設定多行程航段（推薦使用）
    setMultiTripSegments(segments: FlightSegment[]) {
      this.segments = [...segments]
      
      // 向後相容：同步更新舊欄位
      this.outboundSegment = segments[0] || null
      this.returnSegment = segments[1] || null
    },

    // 新增：設定單一航段（用於單程、去程、回程）
    setSingleSegment(segment: FlightSegment, index: number = 0) {
      if (index >= this.segments.length) {
        // 擴展陣列到所需長度
        while (this.segments.length <= index) {
          this.segments.push({} as FlightSegment)
        }
      }
      this.segments[index] = segment
      
      // 向後相容：同步更新舊欄位
      if (index === 0) this.outboundSegment = segment
      if (index === 1) this.returnSegment = segment
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
        this.$state.segments = parsedData.segments || []
        this.$state.outboundSegment = parsedData.outboundSegment
        this.$state.returnSegment = parsedData.returnSegment
        this.$state.selectedFare = parsedData.selectedFare
        this.$state.fareRuleData = parsedData.fareRuleData
        this.$state.searchParams = parsedData.searchParams
        this.$state.bookingResult = parsedData.bookingResult
      }
    },
    saveBookingData() {
      localStorage.setItem('BOOKING_DATA', JSON.stringify(this.$state))
    },
    clearBookingData() {
      localStorage.removeItem('BOOKING_DATA')
    }
  },
})
