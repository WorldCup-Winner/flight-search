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
  const currentOutboundRefNumber = ref<number | null>(null)

  // Auto-fetch return results with cheapest outbound when outbound results first arrive
  watch(
    () => props.value.outboundResults,
    (results) => {
      if (
        props.value.tripType === 'roundtrip' &&
        props.value.currentSegmentIndex === 0 &&
        results &&
        results.length > 0 &&
        currentOutboundRefNumber.value === null
      ) {
        // Use first result (already sorted by price, cheapest first)
        const firstFlight = results[0]
        
        if (firstFlight && firstFlight.refNumber) {
          currentOutboundRefNumber.value = firstFlight.refNumber
          
          // Fetch return results with first (cheapest) outbound's refNumber
          fetchReturnResults(firstFlight.refNumber)
        }
      }
    },
    { immediate: true }
  )

  // Fetch return results with selected outbound refNumber
  async function fetchReturnResults(outboundRefNumber: number) {
    if (!props.value.searchRequest) return
    
    const returnDate = props.value.searchRequest.flightSegments?.[0]?.returnDate
    if (!returnDate) return

    // Update current outbound refNumber
    currentOutboundRefNumber.value = outboundRefNumber
    
    // Clear previous results immediately to show skeleton when clicking a different card
    returnResults.value = []
    
    // Show loading skeleton immediately
    isLoadingReturn.value = true

    try {
      const returnRequest = {
        ...props.value.searchRequest,
        selectedRefNumbers: [outboundRefNumber]
      }
      
      const response = await flightSearch(returnRequest)
      
      // Only update if this is still the current request (user didn't click another card)
      if (currentOutboundRefNumber.value === outboundRefNumber) {
        if (response.data?.data) {
          // API returns results sorted by price (cheapest first), so first result is cheapest
          returnResults.value = Array.isArray(response.data.data) ? response.data.data : []
          onReturnResultsFetched?.(returnResults.value)
        } else {
          returnResults.value = []
        }
      }
      // If user clicked another card, this response is stale - ignore it
    } catch (error) {
      // Only handle error if this is still the current request
      if (currentOutboundRefNumber.value === outboundRefNumber) {
        console.error('Error fetching return results:', error)
        returnResults.value = []
      }
    } finally {
      // Only clear loading if this is still the current request
      if (currentOutboundRefNumber.value === outboundRefNumber) {
        isLoadingReturn.value = false
      }
    }
  }

  // Get cheapest return for summary (first result, already sorted by price)
  const cheapestReturn = computed(() => {
    if (returnResults.value.length === 0) return null
    // First result is cheapest (API returns sorted by price ascending)
    return returnResults.value[0] || null
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
      
      // API price already includes tax, use it directly
      const price = returnFlight.price ?? 0
      const currency = (returnFlight as any).currency || props.value.searchRequest?.currency || 'TWD'

      return {
        segmentTitle: '回程',
        timeRange,
        price: price,
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
      
      /**
       * Price handling:
       * - If outbound has totalPrice (from segment selection), it's the raw API price (with tax)
       * - If not, use price directly (API price already includes tax)
       * - Never add taxAmount to price as it's already included
       */
      const price = outbound.totalPrice || outbound.price || 0
      const currency = (outbound as any).currency || props.value.searchRequest?.currency || 'TWD'

      return {
        segmentTitle: '去程',
        timeRange,
        price: price,
        currency
      }
    }
  })

  return {
    returnResults,
    isLoadingReturn,
    currentOutboundRefNumber,
    summaryData,
    fetchReturnResults
  }
}

