import { computed, ref, watch } from 'vue'
import { flightSearch } from '@/api'
import type { CardRow } from '@/utils/types'

/**
 * Composable for managing round-trip summary logic
 * Handles auto-selecting cheapest outbound and fetching return results
 */
export function useRoundTripSummary(
  getProps: () => {
    tripType: string
    currentSegmentIndex?: number
    outboundResults: CardRow[]
    searchRequest?: any
    selectedSegments?: any[]
  },
  onReturnResultsFetched?: (results: CardRow[]) => void
) {
  const props = computed(getProps)
  
  const returnResults = ref<CardRow[]>([])
  const isLoadingReturn = ref(false)
  const cheapestOutbound = ref<CardRow | null>(null)

  /**
   * Find the cheapest flight from an array of flights
   * Compares prices with tax included (price + taxAmount)
   */
  function findCheapestFlight(flights: CardRow[]): CardRow | null {
    if (!flights || flights.length === 0) return null
    console.log(flights)
    
    return flights.reduce((cheapest, flight) => {
      if (!flight || typeof flight.price !== 'number') return cheapest
      if (!cheapest) return flight
      
      // Compare prices with tax included
      const cheapestPriceWithTax = cheapest.price + (cheapest.taxAmount ?? 0)
      const flightPriceWithTax = flight.price + (flight.taxAmount ?? 0)
      
      return flightPriceWithTax < cheapestPriceWithTax ? flight : cheapest
    }, null as CardRow | null)
  }

  // Auto-select cheapest outbound when outbound results arrive
  watch(
    () => props.value.outboundResults,
    (results) => {
      if (
        props.value.tripType === 'roundtrip' &&
        props.value.currentSegmentIndex === 0 &&
        results &&
        results.length > 0 &&
        !cheapestOutbound.value
      ) {
        // Find cheapest outbound flight
        const cheapest = findCheapestFlight(results)
        console.log("CHEAPEST OUTBOUND", cheapest)
        
        if (cheapest && cheapest.refNumber) {
          cheapestOutbound.value = cheapest
          
          // Fetch return results with cheapest outbound's refNumber
          fetchReturnResults(cheapest.refNumber)
        }
      }
    },
    { immediate: true }
  )

  // Fetch return results with selected outbound refNumber
  async function fetchReturnResults(outboundRefNumber: number) {
    if (!props.value.searchRequest) return
    if (isLoadingReturn.value) return
    
    const returnDate = props.value.searchRequest.flightSegments?.[0]?.returnDate
    if (!returnDate) return

    try {
      isLoadingReturn.value = true
      
      const returnRequest = {
        ...props.value.searchRequest,
        selectedRefNumbers: [outboundRefNumber]
      }
      
      const response = await flightSearch(returnRequest)
      
      if (response.data?.data) {
        returnResults.value = response.data.data as CardRow[]
        onReturnResultsFetched?.(returnResults.value)
      }
    } catch (error) {
      console.error('Error fetching return results:', error)
      returnResults.value = []
    } finally {
      isLoadingReturn.value = false
    }
  }

  // Get cheapest return for summary
  const cheapestReturn = computed(() => {
    if (returnResults.value.length === 0) return null
    return findCheapestFlight(returnResults.value)
  })

  // Get selected outbound for summary (when viewing return)
  const selectedOutbound = computed(() => {
    if (props.value.selectedSegments && props.value.selectedSegments.length > 0) {
      return props.value.selectedSegments[0]
    }
    return null
  })

  // Summary data for HeaderStripSummary
  const summaryData = computed(() => {
    if (props.value.tripType !== 'roundtrip') {
      return null
    }

    const isViewingOutbound = props.value.currentSegmentIndex === 0

    if (isViewingOutbound) {
      // Show cheapest return
      const returnFlight = cheapestReturn.value
      if (!returnFlight) return null

      const timeRange = returnFlight.departureTime && returnFlight.arrivalTime
        ? `${returnFlight.departureTime}-${returnFlight.arrivalTime}`
        : null
      
      const priceWithTax = returnFlight.price + (returnFlight.taxAmount ?? 0)
      const currency = (returnFlight as any).currency || props.value.searchRequest?.currency || 'TWD'

      return {
        segmentTitle: '回程',
        timeRange,
        price: priceWithTax,
        currency
      }
    } else {
      // Show selected outbound
      const outbound = selectedOutbound.value
      if (!outbound) return null

      const sectors = outbound.sectors || []
      const firstSector = sectors[0]
      const lastSector = sectors[sectors.length - 1]
      
      const timeRange = firstSector?.departureTime && lastSector?.arrivalTime
        ? `${firstSector.departureTime}-${lastSector.arrivalTime}`
        : null
      
      // Calculate price with tax included (same logic as return flight)
      const basePrice = outbound.totalPrice || outbound.price || 0
      const taxAmount = (outbound as any).taxAmount ?? 0
      const priceWithTax = basePrice + taxAmount
      const currency = (outbound as any).currency || props.value.searchRequest?.currency || 'TWD'

      return {
        segmentTitle: '去程',
        timeRange,
        price: priceWithTax,
        currency
      }
    }
  })

  return {
    returnResults,
    isLoadingReturn,
    cheapestOutbound,
    summaryData,
    fetchReturnResults
  }
}

