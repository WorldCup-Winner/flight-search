/**
 * URL Parameter Synchronization Utilities
 * 
 * This module provides utilities to sync search params and selected flights
 * with URL query parameters, enabling proper browser back/forward navigation.
 */

import type { LocationQuery } from 'vue-router'

export interface SearchParams {
  tripType: 'oneway' | 'roundtrip' | 'multi'
  
  // Single/Round trip fields
  departureCity?: string
  arrivalCity?: string
  departureCityCode?: string
  arrivalCityCode?: string
  departureDate?: string
  returnDate?: string
  
  // Multi-trip fields (segments array)
  segments?: Array<{
    departureCity: string
    arrivalCity: string
    departureCityCode: string
    arrivalCityCode: string
    departureDate: string
  }>
  
  // Passengers
  adults: number
  children: number
  infants: number
  
  // Filter preferences
  airlineCode?: string
  airlineName?: string
  cabinClass?: string
  nonStop?: boolean
  
  // Selected flights (refNumbers for each segment)
  selectedRefs?: string[]
  
  // Current segment index (for multi-segment flows)
  currentSegmentIndex?: number
  
  // Filter state (for ResultsMain)
  filters?: {
    studentOnly?: boolean
    stops?: { direct?: boolean; oneStop?: boolean }
    alliances?: string[]
    airlines?: string[]
    depAirports?: string[]
    arrAirports?: string[]
    departTime?: [number, number]
    arriveTime?: [number, number]
  }
  
  // Sort state (for ResultsMain)
  sort?: {
    key?: 'direct' | 'price' | 'depTime' | 'arrTime' | 'duration'
    dir?: 'asc' | 'desc'
  }
  
  // Tax mode (for ResultsMain)
  taxMode?: 'in' | 'ex'
}

/**
 * Serialize search params to URL query object
 */
export function serializeSearchParams(params: SearchParams): Record<string, string> {
  const query: Record<string, string> = {
    tripType: params.tripType,
    adults: String(params.adults),
    children: String(params.children),
    infants: String(params.infants),
  }
  
  if (params.tripType === 'multi' && params.segments) {
    // Multi-trip: encode each segment
    params.segments.forEach((seg, idx) => {
      query[`dep${idx}`] = seg.departureCity
      query[`depCode${idx}`] = seg.departureCityCode
      query[`arr${idx}`] = seg.arrivalCity
      query[`arrCode${idx}`] = seg.arrivalCityCode
      query[`date${idx}`] = seg.departureDate
    })
  } else {
    // Single/Round trip
    if (params.departureCity) query.dep = params.departureCity
    if (params.departureCityCode) query.depCode = params.departureCityCode
    if (params.arrivalCity) query.arr = params.arrivalCity
    if (params.arrivalCityCode) query.arrCode = params.arrivalCityCode
    if (params.departureDate) query.date = params.departureDate
    if (params.returnDate) query.returnDate = params.returnDate
  }
  
  // Filter preferences
  if (params.airlineCode) query.airline = params.airlineCode
  if (params.airlineName) query.airlineName = params.airlineName
  if (params.cabinClass) query.cabin = params.cabinClass
  if (params.nonStop) query.nonStop = 'true'
  
  // Selected flight references (comma-separated)
  if (params.selectedRefs && params.selectedRefs.length > 0) {
    query.selectedRefs = params.selectedRefs.join(',')
  }
  
  // Current segment index (for step navigation)
  if (params.currentSegmentIndex !== undefined && params.currentSegmentIndex > 0) {
    query.step = String(params.currentSegmentIndex)
  }
  
  // Filter state
  if (params.filters) {
    const f = params.filters
    if (f.studentOnly) query.filterStudent = 'true'
    if (f.stops?.direct) query.filterDirect = 'true'
    if (f.stops?.oneStop) query.filterOneStop = 'true'
    if (f.alliances && f.alliances.length > 0) query.filterAlliances = f.alliances.join(',')
    if (f.airlines && f.airlines.length > 0) query.filterAirlines = f.airlines.join(',')
    if (f.depAirports && f.depAirports.length > 0) query.filterDepAirports = f.depAirports.join(',')
    if (f.arrAirports && f.arrAirports.length > 0) query.filterArrAirports = f.arrAirports.join(',')
    if (f.departTime && (f.departTime[0] !== 0 || f.departTime[1] !== 1439)) {
      query.filterDepartTime = `${f.departTime[0]},${f.departTime[1]}`
    }
    if (f.arriveTime && (f.arriveTime[0] !== 0 || f.arriveTime[1] !== 1439)) {
      query.filterArriveTime = `${f.arriveTime[0]},${f.arriveTime[1]}`
    }
  }
  
  // Sort state
  if (params.sort) {
    if (params.sort.key && params.sort.key !== 'price') query.sortKey = params.sort.key
    if (params.sort.dir && params.sort.dir !== 'asc') query.sortDir = params.sort.dir
  }
  
  // Tax mode
  if (params.taxMode && params.taxMode !== 'in') {
    query.taxMode = params.taxMode
  }
  
  return query
}

/**
 * Deserialize URL query to search params object
 */
export function deserializeSearchParams(query: LocationQuery): SearchParams | null {
  const tripType = query.tripType as string
  
  if (!tripType || !['oneway', 'roundtrip', 'multi'].includes(tripType)) {
    return null
  }
  
  const params: SearchParams = {
    tripType: tripType as 'oneway' | 'roundtrip' | 'multi',
    adults: parseInt(query.adults as string) || 1,
    children: parseInt(query.children as string) || 0,
    infants: parseInt(query.infants as string) || 0,
  }
  
  if (tripType === 'multi') {
    // Multi-trip: decode segments
    const segments: SearchParams['segments'] = []
    let idx = 0
    
    while (query[`dep${idx}`]) {
      segments.push({
        departureCity: query[`dep${idx}`] as string,
        departureCityCode: query[`depCode${idx}`] as string,
        arrivalCity: query[`arr${idx}`] as string,
        arrivalCityCode: query[`arrCode${idx}`] as string,
        departureDate: query[`date${idx}`] as string,
      })
      idx++
    }
    
    if (segments.length > 0) {
      params.segments = segments
    } else {
      // No valid segments found
      return null
    }
  } else {
    // Single/Round trip
    params.departureCity = query.dep as string
    params.departureCityCode = query.depCode as string
    params.arrivalCity = query.arr as string
    params.arrivalCityCode = query.arrCode as string
    params.departureDate = query.date as string
    
    if (tripType === 'roundtrip') {
      params.returnDate = query.returnDate as string
    }
    
    // Validate required fields
    if (!params.departureCity || !params.arrivalCity || !params.departureDate) {
      return null
    }
    
    if (tripType === 'roundtrip' && !params.returnDate) {
      return null
    }
  }
  
  // Filter preferences
  if (query.airline) params.airlineCode = query.airline as string
  if (query.airlineName) params.airlineName = query.airlineName as string
  if (query.cabin) params.cabinClass = query.cabin as string
  if (query.nonStop === 'true') params.nonStop = true
  
  // Selected flight references
  if (query.selectedRefs) {
    const refsStr = query.selectedRefs as string
    params.selectedRefs = refsStr.split(',').filter(ref => ref.length > 0)
  }
  
  // Current segment index
  if (query.step) {
    params.currentSegmentIndex = parseInt(query.step as string) || 0
  }
  
  // Filter state
  const filters: SearchParams['filters'] = {}
  if (query.filterStudent === 'true') filters.studentOnly = true
  if (query.filterDirect === 'true') {
    filters.stops = { ...filters.stops, direct: true }
  }
  if (query.filterOneStop === 'true') {
    filters.stops = { ...filters.stops, oneStop: true }
  }
  if (query.filterAlliances) {
    filters.alliances = (query.filterAlliances as string).split(',').filter(s => s.length > 0)
  }
  if (query.filterAirlines) {
    filters.airlines = (query.filterAirlines as string).split(',').filter(s => s.length > 0)
  }
  if (query.filterDepAirports) {
    filters.depAirports = (query.filterDepAirports as string).split(',').filter(s => s.length > 0)
  }
  if (query.filterArrAirports) {
    filters.arrAirports = (query.filterArrAirports as string).split(',').filter(s => s.length > 0)
  }
  if (query.filterDepartTime) {
    const [start, end] = (query.filterDepartTime as string).split(',').map(Number)
    if (!isNaN(start) && !isNaN(end)) {
      filters.departTime = [start, end] as [number, number]
    }
  }
  if (query.filterArriveTime) {
    const [start, end] = (query.filterArriveTime as string).split(',').map(Number)
    if (!isNaN(start) && !isNaN(end)) {
      filters.arriveTime = [start, end] as [number, number]
    }
  }
  // Only add filters object if it has any properties
  if (Object.keys(filters).length > 0) {
    params.filters = filters
  }
  
  // Sort state
  if (query.sortKey || query.sortDir) {
    params.sort = {}
    if (query.sortKey) {
      const validKeys = ['direct', 'price', 'depTime', 'arrTime', 'duration']
      if (validKeys.includes(query.sortKey as string)) {
        params.sort.key = query.sortKey as 'direct' | 'price' | 'depTime' | 'arrTime' | 'duration'
      }
    }
    if (query.sortDir) {
      if (query.sortDir === 'asc' || query.sortDir === 'desc') {
        params.sort = params.sort || {}
        params.sort.dir = query.sortDir as 'asc' | 'desc'
      }
    }
  }
  
  // Tax mode
  if (query.taxMode === 'ex' || query.taxMode === 'in') {
    params.taxMode = query.taxMode
  }
  
  return params
}

/**
 * Check if URL has search params
 */
export function hasSearchParams(query: LocationQuery): boolean {
  return !!query.tripType
}

/**
 * Build search request payload from search params
 * (compatible with existing API structure)
 */
export function buildSearchRequest(params: SearchParams): any {
  const cabinMap: Record<string, string | null> = {
    '艙等不限': null,
    '經濟艙': 'M',
    '豪華經濟艙': 'W',
    '商務艙': 'C',
    '頭等艙': 'F'
  }
  
  if (params.tripType === 'multi') {
    // Multi-trip format - using flightSegments structure (same as MultiSearchBox)
    return {
      flightSegments: params.segments?.map((seg, idx) => ({
        order: idx + 1,
        departureLocation: seg.departureCityCode,
        arrivalLocation: seg.arrivalCityCode,
        departureDate: seg.departureDate,
        returnDate: null
      })),
      adultCount: params.adults,
      childCount: params.children,
      babyCount: params.infants,
      carrierId: params.airlineCode || null,
      cabinId: params.cabinClass ? (cabinMap[params.cabinClass] || null) : null,
      isNonStopFlight: params.nonStop || false,
      selectedRefNumbers: []
    }
  } else if (params.tripType === 'roundtrip') {
    // Round trip format - using flightSegments structure
    return {
      flightSegments: [
        {
          order: 1,
          departureLocation: params.departureCityCode,
          arrivalLocation: params.arrivalCityCode,
          departureDate: params.departureDate,
          returnDate: params.returnDate,
        }
      ],
      adultCount: params.adults,
      childCount: params.children,
      babyCount: params.infants,
      carrierId: params.airlineCode || null,
      cabinId: params.cabinClass ? (cabinMap[params.cabinClass] || null) : null,
      isNonStopFlight: params.nonStop || false,
      selectedRefNumbers: []
    }
  } else {
    // One-way format - using flightSegments structure
    return {
      flightSegments: [
        {
          order: 1,
          departureLocation: params.departureCityCode,
          arrivalLocation: params.arrivalCityCode,
          departureDate: params.departureDate,
          returnDate: null
        }
      ],
      adultCount: params.adults,
      childCount: params.children,
      babyCount: params.infants,
      carrierId: params.airlineCode || null,
      cabinId: params.cabinClass ? (cabinMap[params.cabinClass] || null) : null,
      isNonStopFlight: params.nonStop || false,
      selectedRefNumbers: []
    }
  }
}

/**
 * Extract search params from a search request object
 */
export function extractSearchParamsFromRequest(request: any, tripType: 'oneway' | 'roundtrip' | 'multi'): SearchParams {
  const cabinMap: Record<string, string> = {
    'M': '經濟艙',
    'W': '豪華經濟艙',
    'C': '商務艙',
    'F': '頭等艙'
  }
  
  if (tripType === 'multi') {
    // Handle both formats: slices (old API format) and flightSegments (MultiSearchBox format)
    let segments = []
    
    if (request.slices) {
      // Old API format with slices
      segments = request.slices.map((slice: any) => ({
        departureCity: '', // Will be filled from location store
        arrivalCity: '',
        departureCityCode: slice.origin,
        arrivalCityCode: slice.destination,
        departureDate: slice.departureDate,
      }))
    } else if (request.flightSegments) {
      // MultiSearchBox format with flightSegments
      segments = request.flightSegments.map((segment: any) => ({
        departureCity: '', // Will be filled from location store
        arrivalCity: '',
        departureCityCode: segment.departureLocation,
        arrivalCityCode: segment.arrivalLocation,
        departureDate: segment.departureDate,
      }))
    }
    
    return {
      tripType: 'multi',
      segments,
      adults: request.adultCount || request.passengers?.ADT || 1,
      children: request.childCount || request.passengers?.CHD || 0,
      infants: request.babyCount || request.passengers?.INF || 0,
      airlineCode: request.carrierId || undefined,
      cabinClass: request.cabinId ? (cabinMap[request.cabinId] || undefined) : undefined,
      nonStop: request.isNonStopFlight || undefined,
    }
  } else {
    // Handle both formats: flightSegments (from RoundSearchBox) and origin/destination (from API)
    let departureCityCode = request.origin
    let arrivalCityCode = request.destination
    let departureDate = request.departureDate
    let returnDate = request.returnDate
    
    // If using flightSegments format
    if (request.flightSegments && request.flightSegments.length > 0) {
      const segment = request.flightSegments[0]
      departureCityCode = segment.departureLocation
      arrivalCityCode = segment.arrivalLocation
      departureDate = segment.departureDate
      returnDate = segment.returnDate
    }
    
    return {
      tripType,
      departureCity: '', // Will be filled from location store
      arrivalCity: '',
      departureCityCode,
      arrivalCityCode,
      departureDate,
      returnDate,
      adults: request.adultCount || request.passengers?.ADT || 1,
      children: request.childCount || request.passengers?.CHD || 0,
      infants: request.babyCount || request.passengers?.INF || 0,
      airlineCode: request.carrierId || undefined,
      cabinClass: request.cabinId ? (cabinMap[request.cabinId] || undefined) : undefined,
      nonStop: request.isNonStopFlight || undefined,
    }
  }
}
