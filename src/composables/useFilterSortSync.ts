import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deserializeSearchParams, serializeSearchParams } from '@/utils/urlParamsSync'
import type { CardRow } from '@/utils/types'

/**
 * Composable for managing filter, sort, and taxMode state with URL synchronization
 * 
 * Handles:
 * - Initializing filters, sort, and taxMode from URL query params
 * - Syncing state changes back to URL
 * - Providing reactive state and handlers for components
 */
export function useFilterSortSync() {
  const route = useRoute()
  const router = useRouter()
  
  // Get search params from URL (computed to react to route changes)
  const searchParamsFromUrl = computed(() => deserializeSearchParams(route.query))
  
  // ---------- Filters (from sidebar) ----------
  // Initialize from URL if available, otherwise use defaults
  const filters = reactive<{
    studentOnly: boolean
    stops: { direct: boolean; oneStop: boolean }
    alliances: string[]
    airlines: string[]
    depAirports: string[]
    arrAirports: string[]
    departTime: [number, number]
    arriveTime: [number, number]
  }>({
    studentOnly: searchParamsFromUrl.value?.filters?.studentOnly ?? false,
    stops: {
      direct: searchParamsFromUrl.value?.filters?.stops?.direct ?? false,
      oneStop: searchParamsFromUrl.value?.filters?.stops?.oneStop ?? false
    },
    alliances: searchParamsFromUrl.value?.filters?.alliances ?? [],
    airlines: searchParamsFromUrl.value?.filters?.airlines ?? [],
    depAirports: searchParamsFromUrl.value?.filters?.depAirports ?? [],
    arrAirports: searchParamsFromUrl.value?.filters?.arrAirports ?? [],
    departTime: searchParamsFromUrl.value?.filters?.departTime ?? [0, 1439],
    arriveTime: searchParamsFromUrl.value?.filters?.arriveTime ?? [0, 1439]
  })
  
  // ---------- Sort ----------
  // Initialize from URL if available, otherwise default to price sort (ascending)
  type SortKey = 'direct' | 'price' | 'depTime' | 'arrTime' | 'duration'
  type SortDir = 'asc' | 'desc'
  const sort = reactive<{ key: SortKey; dir: SortDir }>({
    key: (searchParamsFromUrl.value?.sort?.key ?? 'price') as SortKey,
    dir: (searchParamsFromUrl.value?.sort?.dir ?? 'asc') as SortDir
  })
  
  // ---------- Tax toggle & price display ----------
  const taxMode = ref<'in' | 'ex'>(searchParamsFromUrl.value?.taxMode ?? 'in')
  
  // ---------- Sync functions ----------
  function syncFiltersToUrl() {
    const currentParams = deserializeSearchParams(route.query)
    if (!currentParams) return
    
    currentParams.filters = {
      studentOnly: filters.studentOnly || undefined,
      stops: {
        direct: filters.stops.direct || undefined,
        oneStop: filters.stops.oneStop || undefined
      },
      alliances: filters.alliances.length > 0 ? filters.alliances : undefined,
      airlines: filters.airlines.length > 0 ? filters.airlines : undefined,
      depAirports: filters.depAirports.length > 0 ? filters.depAirports : undefined,
      arrAirports: filters.arrAirports.length > 0 ? filters.arrAirports : undefined,
      departTime: (filters.departTime[0] !== 0 || filters.departTime[1] !== 1439) ? filters.departTime : undefined,
      arriveTime: (filters.arriveTime[0] !== 0 || filters.arriveTime[1] !== 1439) ? filters.arriveTime : undefined
    }
    // Remove empty filter properties
    if (currentParams.filters) {
      Object.keys(currentParams.filters).forEach(key => {
        const value = (currentParams.filters as any)[key]
        if (value === undefined || (Array.isArray(value) && value.length === 0)) {
          delete (currentParams.filters as any)[key]
        }
      })
      if (Object.keys(currentParams.filters).length === 0) {
        delete currentParams.filters
      }
    }
    
    const query = serializeSearchParams(currentParams)
    router.replace({ query })
  }
  
  function syncSortToUrl() {
    const currentParams = deserializeSearchParams(route.query)
    if (!currentParams) return
    
    // Only store sort if it's not the default (price asc)
    if (sort.key === 'price' && sort.dir === 'asc') {
      delete currentParams.sort
    } else {
      currentParams.sort = {
        key: sort.key,
        dir: sort.dir
      }
    }
    
    const query = serializeSearchParams(currentParams)
    router.replace({ query })
  }
  
  function syncTaxModeToUrl() {
    const currentParams = deserializeSearchParams(route.query)
    if (!currentParams) return
    
    // Only store taxMode if it's not the default ('in')
    if (taxMode.value === 'in') {
      delete currentParams.taxMode
    } else {
      currentParams.taxMode = taxMode.value
    }
    
    const query = serializeSearchParams(currentParams)
    router.replace({ query })
  }
  
  // ---------- Handler functions ----------
  function onFiltersChange(v: any) {
    Object.assign(filters, v)
    syncFiltersToUrl()
  }
  
  function setSort(key: SortKey, dir: SortDir) {
    sort.key = key
    sort.dir = dir
    syncSortToUrl()
  }
  
  function toggleSort(key: SortKey) {
    if (sort.key !== key) {
      sort.key = key
      sort.dir = 'asc'
    } else {
      sort.dir = sort.dir === 'asc' ? 'desc' : 'asc'
    }
    syncSortToUrl()
  }
  
  function handleTaxModeChange(newMode: 'in' | 'ex') {
    taxMode.value = newMode
    syncTaxModeToUrl()
  }
  
  /**
   * Calculate display price based on taxMode
   * 
   * Price Flow:
   * - API returns: price (WITH tax included), taxAmount (tax portion)
   * - taxMode === 'in': Display price as-is (with tax)
   * - taxMode === 'ex': Display price - taxAmount (without tax)
   * 
   * This calculated value is passed to FlightResultCard as priceFrom prop
   */
  function displayPrice(row: CardRow) {
    // API 回傳的 price 已經含稅
    // 含稅模式：直接顯示 price
    // 未稅模式：顯示 price - taxAmount
    return taxMode.value === 'in' ? row.price : row.price - (row.taxAmount ?? 0)
  }
  
  // Filter initial state for FilterSideBar (to persist checked state)
  const filterInitialState = computed(() => ({
    studentOnly: filters.studentOnly,
    stops: { ...filters.stops },
    alliances: [...filters.alliances],
    airlines: [...filters.airlines],
    depAirports: [...filters.depAirports],
    arrAirports: [...filters.arrAirports],
    departTime: [filters.departTime[0], filters.departTime[1]] as [number, number],
    arriveTime: [filters.arriveTime[0], filters.arriveTime[1]] as [number, number],
  }))
  
  return {
    // Reactive state
    filters,
    sort,
    taxMode,
    filterInitialState,
    
    // Handler functions
    onFiltersChange,
    setSort,
    toggleSort,
    handleTaxModeChange,
    displayPrice,
    
    // Expose for handleSelect to preserve state when navigating
    getFiltersForNavigation: () => filters,
    getSortForNavigation: () => sort,
    getTaxModeForNavigation: () => taxMode.value
  }
}

