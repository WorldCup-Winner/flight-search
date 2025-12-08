import { computed, toRef } from 'vue'
import type { Sector } from '@/utils/types'
import AirlineDefault from '@/assets/imgs/airlines/airline-default.svg'

// Import all airline logos at build time using Vite's glob import
const airlineLogosModules = import.meta.glob('@/assets/imgs/airlines/*.png', { eager: true, import: 'default' })

export function useFlightCardData(getProps: () => {
  sectors?: Sector[]
  airlineCode?: string[]
  airlineName?: string[]
  departureTime?: string
  arrivalTime?: string
  departureAirportCode?: string
  arrivalAirportCode?: string
  departureTerminal?: string
  arrivalTerminal?: string
  durationMinutes?: number
  currency?: string
  priceFrom?: number
  taxMode?: string
}) {
  // Use computed to access props reactively
  const props = computed(getProps)
  const sectors = computed<Sector[]>(() => props.value.sectors ?? [])

  const airlines = computed(() => {
    const currentProps = props.value
    const codes = currentProps.airlineCode ?? []
    const names = currentProps.airlineName ?? []
    
    if (!codes.length && !names.length && sectors.value.length) {
      const uniq = new Map<string, string>()
      sectors.value.forEach(s => {
        const code = s.marketingAirlineCode || s.operatingAirlineCode
        const name = s.marketingAirlineName || s.operatingAirlineName
        if (code) uniq.set(code, name)
      })
      return Array.from(uniq.entries()).map(([code, name]) => ({ code, name, logo: resolveAirlineLogo(code) }))
    }

    return codes.map((code, i) => ({ code, name: names[i] ?? code, logo: resolveAirlineLogo(code) }))
  })

  const departureTime = computed(() => {
    const currentProps = props.value
    return currentProps.departureTime || sectors.value[0]?.departureTime || ''
  })
  const arrivalTime = computed(() => {
    const currentProps = props.value
    return currentProps.arrivalTime || sectors.value[sectors.value.length - 1]?.arrivalTime || ''
  })
  const departureAirportCode = computed(() => {
    const currentProps = props.value
    return currentProps.departureAirportCode || sectors.value[0]?.departureAirportCode || ''
  })
  const arrivalAirportCode = computed(() => {
    const currentProps = props.value
    return currentProps.arrivalAirportCode || sectors.value[sectors.value.length - 1]?.arrivalAirportCode || ''
  })
  const departureTerminal = computed(() => {
    const currentProps = props.value
    return currentProps.departureTerminal || sectors.value[0]?.departureTerminal || ''
  })
  const arrivalTerminal = computed(() => {
    const currentProps = props.value
    return currentProps.arrivalTerminal || sectors.value[sectors.value.length - 1]?.arrivalTerminal || ''
  })

  const totalMinutes = computed(() => {
    const currentProps = props.value
    return currentProps.durationMinutes ?? sectors.value.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)
  })
  const stopsCount = computed(() => Math.max(0, sectors.value.length - 1))

  const currencyDisplay = computed(() => props.value.currency ?? 'TWD')
  const priceTotal = computed(() => (props.value.priceFrom ?? 0))
  const taxMode = computed<'in' | 'ex'>(() => (props.value.taxMode === 'ex' ? 'ex' : 'in'))

  function resolveAirlineLogo(code?: string): string {
    if (!code) return AirlineDefault
    
    const fullPath = Object.keys(airlineLogosModules).find(path => path.includes(`/${code}.png`))
    
    if (fullPath && airlineLogosModules[fullPath]) {
      return airlineLogosModules[fullPath] as string
    }
    
    return AirlineDefault
  }

  function airlineLogoFor(sec: Sector) {
    const code = sec.marketingAirlineCode || sec.operatingAirlineCode
    return resolveAirlineLogo(code)
  }

  function onImageError(event: Event) {
    const target = event.target as HTMLImageElement
    target.src = AirlineDefault
  }

  return {
    sectors,
    airlines,
    departureTime,
    arrivalTime,
    departureAirportCode,
    arrivalAirportCode,
    departureTerminal,
    arrivalTerminal,
    totalMinutes,
    stopsCount,
    currencyDisplay,
    priceTotal,
    taxMode,
    resolveAirlineLogo,
    airlineLogoFor,
    onImageError
  }
}

