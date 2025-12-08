import { defineStore } from 'pinia'
import type { FareRuleResponse } from '@/utils/types'

// 航段資訊
export interface FlightSegment {
  refNumber: string
  sectors: any[]
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
  // 新增：從 flight-search API 取得的欄位
  validatingAirlineCode?: string
  itineraryRBDs?: string
}

// 訂票資訊
export interface BookingInfo {
  // 航班資訊（彈性支援單程、來回、多行程）
  segments: FlightSegment[]  // 所有已選擇的航段（單程1個、來回2個、多行程N個）
  
  // 為了向後相容，保留舊的欄位但標記為 deprecated
  /** @deprecated 請使用 segments[0] */
  outboundSegment: FlightSegment | null
  /** @deprecated 請使用 segments[1] */
  returnSegment: FlightSegment | null
  
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
    outboundSegment: null,  // 向後相容
    returnSegment: null,    // 向後相容
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
  },

actions: {
    // 設定訂票資訊
    setBookingInfo(data: Partial<BookingInfo>) {
      Object.assign(this.$state, data)
      this.saveBookingData()
    },

    setBookingResult(result: any) {
      this.bookingResult = result
      this.saveBookingData()
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
      this.clearBookingData()
      // 清除 sessionStorage 中的 bookingStep，確保新搜尋從 step 2 開始
      sessionStorage.removeItem('bookingStep')
    },
    
    // === 新的彈性方法 ===
    
    // 新增航段（適用於所有行程類型）
    addSegment(segment: FlightSegment) {
      this.segments.push(segment)
      
      // 向後相容：同步更新舊欄位
      if (this.segments.length === 1) {
        this.outboundSegment = segment
      } else if (this.segments.length === 2) {
        this.returnSegment = segment
      }
      this.saveBookingData()
    },
    
    // 設定特定索引的航段
    setSegment(index: number, segment: FlightSegment) {
      if (index >= 0 && index < this.segments.length) {
        this.segments[index] = segment
        
        // 向後相容：同步更新舊欄位
        if (index === 0) this.outboundSegment = segment
        if (index === 1) this.returnSegment = segment
        this.saveBookingData()
      }
    },
    
    // 設定所有航段（覆蓋現有）
    setSegments(segments: FlightSegment[]) {
      this.segments = [...segments]
      
      // 向後相容：同步更新舊欄位
      this.outboundSegment = segments[0] || null
      this.returnSegment = segments[1] || null
      this.saveBookingData()
    },
    
    // 移除特定航段
    removeSegment(index: number) {
      if (index >= 0 && index < this.segments.length) {
        this.segments.splice(index, 1)
        
        // 向後相容：同步更新舊欄位
        this.outboundSegment = this.segments[0] || null
        this.returnSegment = this.segments[1] || null
        this.saveBookingData()
      }
    },
    
    // 取得特定航段
    getSegment(index: number): FlightSegment | null {
      return this.segments[index] || null
    },
    
    // === 向後相容的舊方法（已棄用但保留） ===
    
    /** @deprecated 請使用 addSegment() 或 setSegments() */
    setOutboundSegment(segment: FlightSegment) {
      if (this.segments.length === 0) {
        this.segments.push(segment)
      } else {
        this.segments[0] = segment
      }
      this.outboundSegment = segment
    },
    
    /** @deprecated 請使用 addSegment() 或 setSegments() */
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
    
    // === 其他方法 ===
    
    // 設定選擇的票價
    setSelectedFare(fare: any) {
      this.selectedFare = fare
      this.saveBookingData()
    },
    
    // 設定 fare-rule 資料
    setFareRuleData(data: FareRuleResponse['data']) {
      this.fareRuleData = data
      this.saveBookingData()
    },
    
    // 設定搜尋參數
    setSearchParams(params: any) {
      this.searchParams = params
      this.saveBookingData()
    },
    
    // === localStorage 持久化方法 ===
    
    // 從 localStorage 載入訂票資料
    getBookingData() {
      const stored = localStorage.getItem('BOOKING_DATA')
      if (stored) {
        try {
          const parsedData = JSON.parse(stored)
          this.$state.segments = parsedData.segments || []
          this.$state.outboundSegment = parsedData.outboundSegment
          this.$state.returnSegment = parsedData.returnSegment
          this.$state.selectedFare = parsedData.selectedFare
          this.$state.fareRuleData = parsedData.fareRuleData
          this.$state.searchParams = parsedData.searchParams
          this.$state.bookingResult = parsedData.bookingResult
        } catch (error) {
          console.error('Error parsing booking data from localStorage:', error)
        }
      }
    },
    
    // 儲存訂票資料到 localStorage
    saveBookingData() {
      try {
        localStorage.setItem('BOOKING_DATA', JSON.stringify(this.$state))
      } catch (error) {
        console.error('Error saving booking data to localStorage:', error)
      }
    },
    
    // 清除 localStorage 中的訂票資料
    clearBookingData() {
      localStorage.removeItem('BOOKING_DATA')
    },
  },
})
