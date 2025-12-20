/**
 * Route Helper Utilities
 * 
 * Modular functions for parsing route parameters and building component props
 * Used by Vue Router to pass props to route components
 */

import type { RouteLocationNormalized } from 'vue-router'
import { deserializeSearchParams, buildSearchRequest, type SearchParams } from './urlParamsSync'

/**
 * Parse route props for ResultsMain component
 * Extracts tripType, segmentIndex, and searchRequest from route
 */
export function parseResultsMainProps(route: RouteLocationNormalized) {
  const routeName = route.name as string
  
  // Determine tripType and segmentIndex from route name
  let tripType: 'oneway' | 'roundtrip' | 'multi' = 'oneway'
  let segmentIndex = 0
  
  if (routeName === 'search-oneway') {
    tripType = 'oneway'
    segmentIndex = 0
  } else if (routeName === 'search-outbound') {
    tripType = 'roundtrip'
    segmentIndex = 0
  } else if (routeName === 'search-return') {
    tripType = 'roundtrip'
    segmentIndex = 1
  } else if (routeName === 'search-segment') {
    tripType = 'multi'
    segmentIndex = parseInt(route.params.index as string) || 0
  }
  
  // Parse search params from query
  const searchParams = deserializeSearchParams(route.query)
  
  if (!searchParams) {
    // Invalid search params, return minimal props
    return {
      tripType,
      segmentIndex,
      searchRequest: null
    }
  }
  
  // Build search request from params
  const searchRequest = buildSearchRequest(searchParams)
  
  // Add selectedRefNumbers if present in URL
  if (searchParams.selectedRefs && searchParams.selectedRefs.length > 0) {
    searchRequest.selectedRefNumbers = searchParams.selectedRefs.map(ref => parseInt(ref))
  }
  
  return {
    tripType,
    segmentIndex,
    searchRequest
  }
}

/**
 * Parse route props for StepTwoMobileSummary component
 * Extracts search params from route query
 */
export function parseSummaryProps(route: RouteLocationNormalized) {
  const searchParams = deserializeSearchParams(route.query)
  return searchParams || null
}

/**
 * Determine route name from search params (for redirects)
 * Returns route name and optional params
 */
export function determineSearchRoute(searchParams: SearchParams | null): { name: string; params?: Record<string, string> } {
  if (!searchParams) return { name: 'home' }
  
  const { tripType, currentSegmentIndex = 0 } = searchParams
  
  if (tripType === 'oneway') {
    return { name: 'search-oneway' }
  } else if (tripType === 'roundtrip') {
    return { name: currentSegmentIndex === 0 ? 'search-outbound' : 'search-return' }
  } else if (tripType === 'multi') {
    return { 
      name: 'search-segment',
      params: { index: String(currentSegmentIndex) }
    }
  }
  
  return { name: 'home' }
}

