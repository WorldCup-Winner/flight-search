import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fareRule } from '@/api'
import type { FareRuleResponse, FareRuleRequest, SegmentPick, PaxMix, FareOption, Sector, FareNoteType, FareIconType } from '@/utils/types'

export function useFlightFareRule(getProps: () => {
  sectors?: Sector[]
  previousSegments?: Array<{ sectors: Sector[] }>
  tripType: string
  leg: 'outbound' | 'return'
  adultCount?: number
  childCount?: number
  babyCount?: number
  validatingAirlineCode?: string
  itineraryRBDs?: string | string[]
  fareOptions?: FareOption[]
  // 從 flight-search API 取得的價格（用於展開後顯示）
  flightSearchPrice?: number
  flightSearchTaxAmount?: number
}) {
  // Use computed to access props reactively
  const props = computed(getProps)
  const fareRuleData = ref<FareRuleResponse['data'] | null>(null)
  const fareRuleLoading = ref(false)
  const fareRuleError = ref<string | null>(null)
  const dynamicFareOptions = ref<FareOption[]>([])
  const show404Dialog = ref(false)
  const fareShow = ref(2)

  const router = useRouter()
  const route = useRoute()

  const visibleFares = computed(() => {
    const currentProps = props.value
    const options = dynamicFareOptions.value.length > 0 ? dynamicFareOptions.value : (currentProps.fareOptions ?? [])
    return options.slice(0, fareShow.value)
  })

  async function fetchFareRule() {
    const currentProps = props.value
    
    if (!currentProps.sectors || currentProps.sectors.length === 0) {
      console.error('No sectors available for fare rule query')
      return
    }
    
    fareRuleLoading.value = true
    fareRuleError.value = null

    try {
      let segmentsToInclude = currentProps.previousSegments
      if (currentProps.tripType === 'roundtrip' && currentProps.leg === 'return' && currentProps.previousSegments && currentProps.previousSegments.length > 0) {
        segmentsToInclude = [currentProps.previousSegments[0]]
      }
      
      const allSectors = [
        ...(segmentsToInclude?.flatMap((seg: { sectors: Sector[] }) => seg.sectors) ?? []),
        ...currentProps.sectors
      ]
      
      const segments: SegmentPick[] = allSectors.map(sector => {
        const airlineCode = sector.marketingAirlineCode || sector.operatingAirlineCode
        let flightNumber = sector.flightNo || ''
        
        if (airlineCode && flightNumber && flightNumber.startsWith(airlineCode)) {
          flightNumber = flightNumber.substring(airlineCode.length)
        } else if (flightNumber) {
          flightNumber = flightNumber.replace(/^[A-Z]+/, '')
        }
        
        return {
          marketingCarrier: sector.marketingAirlineCode,
          operatingCarrier: sector.operatingAirlineCode,
          flightNumber: flightNumber,
          fromAirport: sector.departureAirportCode,
          toAirport: sector.arrivalAirportCode,
          departureDateLocal: sector.departureDate,
          departureTimeLocal: sector.departureTime,
          rbd: sector.bookingClass,
          cabinType: sector.cabinType
        }
      })

      const pax: PaxMix = {
        adt: currentProps.adultCount ?? 1,
        cnn: currentProps.childCount ?? 0,
        inf: currentProps.babyCount ?? 0
      }

      let itineraryType = 1
      if (currentProps.tripType === 'roundtrip') {
        itineraryType = 2
      } else if (currentProps.tripType === 'multi') {
        itineraryType = 3
      }

      // Build request exactly like original - only include optional fields if they exist
      const request: any = { 
        segments, 
        pax,
        itineraryType
      }
      
      if (currentProps.validatingAirlineCode) {
        request.validatingAirlineCode = currentProps.validatingAirlineCode
      }
      
      // Handle itineraryRBDs - match original behavior exactly
      if (currentProps.itineraryRBDs !== undefined && currentProps.itineraryRBDs !== null) {
        if (Array.isArray(currentProps.itineraryRBDs)) {
          // Keep as array (even if empty) - API expects array
          request.itineraryRBDs = currentProps.itineraryRBDs
        } else if (typeof currentProps.itineraryRBDs === 'string' && currentProps.itineraryRBDs !== '') {
          // Only include non-empty strings
          request.itineraryRBDs = currentProps.itineraryRBDs
        }
        // If it's an empty string, don't include it (match original behavior)
      }
      
      const response = await fareRule(request)
      
      if (response.data.head.code === 0) {
        fareRuleData.value = response.data.data
        dynamicFareOptions.value = transformFareRuleToOptions(response.data.data)
      } else {
        if (response.data.head.code === 404 || response.status === 404) {
          show404Dialog.value = true
          fareRuleError.value = null
        } else {
          fareRuleError.value = response.data.head.message || 'Failed to fetch fare rules'
          console.error('Fare rule API error:', fareRuleError.value)
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        show404Dialog.value = true
        fareRuleError.value = null
      } else {
        fareRuleError.value = error.message || 'Error fetching fare rules'
        console.error('Fare rule fetch error:', error)
      }
    } finally {
      fareRuleLoading.value = false
    }
  }

  function transformFareRuleToOptions(data: FareRuleResponse['data']): FareOption[] {
    const transformProps = props.value
    
    let baggageGroup = null
    if (Array.isArray(data.baggage)) {
      if (transformProps.leg === 'outbound') {
        baggageGroup = data.baggage[0]
      } else if (transformProps.leg === 'return') {
        baggageGroup = data.baggage.length > 1 ? data.baggage[1] : data.baggage[0]
      } else {
        baggageGroup = data.baggage[0]
      }
    }

    const notes: { type: FareNoteType; icon: FareIconType; text: string }[] = []
    // 只顯示成人(ADT)的規則以節省空間
    const passengerTypes = ['ADT']
    
    for (const ptc of passengerTypes) {
      const summary = data.fareSummary.find(s => s.passengerType === ptc)
      const baggageInfo = baggageGroup?.passengers?.find(p => p.passengerType === ptc)
      const rules = data.fareRuleTable.filter(r => r.passengerType === ptc)

      if (baggageInfo?.checkInData) {
        const bag = baggageInfo.checkInData
        let baggageText = ''
        if (bag.text) {
          baggageText = `行李${summary?.passengerType === 'ADT' ? '每成人' : summary?.passengerType === 'CNN' ? '每兒童' : '每嬰兒'} ${bag.text}`
        } else if (bag.piece > 0) {
          baggageText = `行李${summary?.passengerType === 'ADT' ? '每成人' : summary?.passengerType === 'CNN' ? '每兒童' : '每嬰兒'} ${bag.piece}*${bag.weight}KG`
        }
        if (baggageText) {
          notes.push({ type: 'allowed', icon: 'suitcase', text: baggageText })
        }
      }

      for (const rule of rules) {
        let label = rule.type
        if (rule.type.includes('去程')) label = '去程改期費'
        if (rule.type.includes('回程')) label = '回程改期費'
        if (rule.type.includes('退票費')) label = '退票費'
        const fee = rule.before !== null ? rule.before : 0
        
        let feeText = ''
        if (fee === -1) {
          feeText = '不可退改'
        } else if (fee === 0) {
          feeText = '免費'
        } else {
          feeText = `${rule.currency} ${fee.toLocaleString()}起`
        }
        
        notes.push({
          type: fee === 0 ? 'allowed' : 'permitted',
          icon: rule.type.includes('退票') ? 'ticket' : 'calendar',
          text: `${label}${feeText}${rule.passengerTypeDisplay ? '（' + rule.passengerTypeDisplay + '）' : ''}`
        })
      }
    }

    const cabinDesc = (transformProps.sectors && transformProps.sectors.length > 0) ? transformProps.sectors[0].cabinDesc : '經濟艙'
    
    // 價格定義：
    // - 所有 API 回傳的 price 都已經含稅
    // - taxAmount 是稅額（僅供參考顯示用）
    let perPersonPrice = 0
    let perPersonTaxAmount = 0
    
    if (transformProps.flightSearchPrice !== undefined) {
      // 直接使用 flight-search API 的價格（已含稅）
      perPersonPrice = transformProps.flightSearchPrice
      perPersonTaxAmount = transformProps.flightSearchTaxAmount ?? 0
    } else {
      // Fallback: 使用 fare-rule API 的成人(ADT)票價作為代表
      const adtSummary = data.fareSummary.find(s => s.passengerType === 'ADT')
      if (adtSummary) {
        perPersonPrice = adtSummary.price ?? 0
        perPersonTaxAmount = adtSummary.taxAmount ?? 0
      }
    }

    return [{
      id: `fare-0`,
      cabin: cabinDesc,
      price: perPersonPrice,
      taxAmount: perPersonTaxAmount,
      notes
    }]
  }

  function handle404Confirm() {
    show404Dialog.value = false
    
    const currentQuery = route.query as Record<string, string | string[]>
    const searchParams: Record<string, string> = {}
    
    Object.keys(currentQuery).forEach(key => {
      if (
        key === 'tripType' ||
        key.startsWith('dep') ||
        key.startsWith('arr') ||
        key.startsWith('date') ||
        key.startsWith('returnDate') ||
        key === 'adults' ||
        key === 'children' ||
        key === 'infants' ||
        key === 'airline' ||
        key === 'cabin' ||
        key === 'nonStop'
      ) {
        const value = currentQuery[key]
        if (Array.isArray(value)) {
          searchParams[key] = value[0]
        } else if (value) {
          searchParams[key] = value
        }
      }
    })
    
    router.push({
      path: '/',
      query: searchParams
    })
  }

  return {
    fareRuleData,
    fareRuleLoading,
    fareRuleError,
    dynamicFareOptions,
    show404Dialog,
    fareShow,
    visibleFares,
    fetchFareRule,
    handle404Confirm
  }
}

