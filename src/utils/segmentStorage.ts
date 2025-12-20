/**
 * Segment Storage Utilities
 * 
 * Handles persistence and reconstruction of selected flight segments
 * Uses sessionStorage for full segment data and URL for refNumbers
 */

import type { CardRow } from './types'

const STORAGE_KEY_PREFIX = 'flightSearch_segments_'

/**
 * Generate storage key from search params
 */
function generateStorageKey(tripType: string, searchHash: string): string {
  return `${STORAGE_KEY_PREFIX}${tripType}_${searchHash}`
}

/**
 * Create a hash from search params (simple hash for cache key)
 * For multi-trip, includes ALL segments to detect changes in any segment
 */
export function createSearchHash(searchRequest: any): string {
  if (!searchRequest) return 'default'
  
  // For multi-trip, include all segments; for single/roundtrip, use first segment
  const flightSegments = searchRequest.flightSegments || []
  
  let key: any
  
  if (flightSegments.length > 1) {
    // Multi-trip: include all segments
    key = {
      segments: flightSegments.map((seg: any) => ({
        dep: seg.departureLocation,
        arr: seg.arrivalLocation,
        date: seg.departureDate
      })),
      adults: searchRequest.adultCount,
      children: searchRequest.childCount,
      infants: searchRequest.babyCount
    }
  } else {
    // Single/Round trip: use first segment (or empty if none)
    key = {
      dep: flightSegments[0]?.departureLocation,
      arr: flightSegments[0]?.arrivalLocation,
      date: flightSegments[0]?.departureDate,
      returnDate: flightSegments[0]?.returnDate, // Include returnDate for roundtrip
      adults: searchRequest.adultCount,
      children: searchRequest.childCount,
      infants: searchRequest.babyCount
    }
  }
  
  // Simple hash function
  const keyStr = JSON.stringify(key)
  let hash = 0
  for (let i = 0; i < keyStr.length; i++) {
    const char = keyStr.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Store selected segment in sessionStorage
 */
export function storeSelectedSegment(
  tripType: string,
  searchRequest: any,
  segmentIndex: number,
  segmentData: any
): void {
  try {
    const searchHash = createSearchHash(searchRequest)
    const storageKey = generateStorageKey(tripType, searchHash)
    
    // Get existing segments or create new
    const existing = sessionStorage.getItem(storageKey)
    const segments = existing ? JSON.parse(existing) : {}
    
    // Store segment at index
    segments[segmentIndex] = {
      ...segmentData,
      timestamp: Date.now()
    }
    
    sessionStorage.setItem(storageKey, JSON.stringify(segments))
  } catch (error) {
    console.error('Error storing segment:', error)
  }
}

/**
 * Rebuild selectedSegments array from URL selectedRefs and sessionStorage
 */
export function rebuildSelectedSegments(
  tripType: string,
  searchRequest: any,
  selectedRefs: string[],
  flightData: CardRow[]
): any[] {
  if (!selectedRefs || selectedRefs.length === 0) {
    return []
  }
  
  try {
    const searchHash = createSearchHash(searchRequest)
    const storageKey = generateStorageKey(tripType, searchHash)
    const stored = sessionStorage.getItem(storageKey)
    
    if (stored) {
      const segments = JSON.parse(stored)
      const result: any[] = []
      
      // Rebuild in order of selectedRefs
      selectedRefs.forEach((refStr, index) => {
        const refNumber = parseInt(refStr)
        
        // First try sessionStorage
        if (segments[index]) {
          result.push(segments[index])
          return
        }
        
        // Fallback: rebuild from flightData
        const flight = flightData.find(f => f.refNumber === refNumber)
        if (flight) {
          const segment = {
            refNumber: flight.refNumber,
            sectors: flight.sectors || [],
            totalMinutes: flight.durationMinutes || 0,
            stopsCount: Math.max(0, (flight.sectors?.length ?? 1) - 1),
            totalPrice: flight.price || 0,
            taxAmount: flight.taxAmount || 0,
            currency: 'TWD',
            roundTripIncluded: tripType === 'roundtrip',
            header: {
              departureTime: flight.departureTime || '',
              arrivalTime: flight.arrivalTime || '',
              departureAirportCode: flight.departureAirportCode || '',
              arrivalAirportCode: flight.arrivalAirportCode || '',
              departureTerminal: flight.departureTerminal || '',
              arrivalTerminal: flight.arrivalTerminal || ''
            },
            validatingAirlineCode: flight.validatingAirlineCode,
            itineraryRBDs: flight.itineraryRBDs
          }
          result.push(segment)
        }
      })
      
      return result
    }
    
    // No sessionStorage, rebuild from flightData only
    return selectedRefs.map((refStr) => {
      const refNumber = parseInt(refStr)
      const flight = flightData.find(f => f.refNumber === refNumber)
      if (!flight) return null
      
      return {
        refNumber: flight.refNumber,
        sectors: flight.sectors || [],
        totalMinutes: flight.durationMinutes || 0,
        stopsCount: Math.max(0, (flight.sectors?.length ?? 1) - 1),
        totalPrice: flight.price || 0,
        taxAmount: flight.taxAmount || 0,
        currency: 'TWD',
        roundTripIncluded: tripType === 'roundtrip',
        header: {
          departureTime: flight.departureTime || '',
          arrivalTime: flight.arrivalTime || '',
          departureAirportCode: flight.departureAirportCode || '',
          arrivalAirportCode: flight.arrivalAirportCode || '',
          departureTerminal: flight.departureTerminal || '',
          arrivalTerminal: flight.arrivalTerminal || ''
        },
        validatingAirlineCode: flight.validatingAirlineCode,
        itineraryRBDs: flight.itineraryRBDs
      }
    }).filter(Boolean) as any[]
  } catch (error) {
    console.error('Error rebuilding segments:', error)
    return []
  }
}

/**
 * Clear stored segments (for new search)
 */
export function clearStoredSegments(tripType: string, searchRequest: any): void {
  try {
    const searchHash = createSearchHash(searchRequest)
    const storageKey = generateStorageKey(tripType, searchHash)
    sessionStorage.removeItem(storageKey)
  } catch (error) {
    console.error('Error clearing segments:', error)
  }
}

