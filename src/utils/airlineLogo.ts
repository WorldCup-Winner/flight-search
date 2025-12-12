import AirlineDefault from '@/assets/imgs/airlines/airline-default.svg'

// Import all airline logos at build time using Vite's glob import
const airlineLogosModules = import.meta.glob('@/assets/imgs/airlines/*.png', {
  eager: true,
  import: 'default',
})

/**
 * Resolve an airline logo URL by airline code.
 * Falls back to a default logo when not found.
 */
export function resolveAirlineLogo(code?: string): string {
  if (!code) return AirlineDefault

  const fullPath = Object.keys(airlineLogosModules).find((path) =>
    path.includes(`/${code}.png`),
  )

  if (fullPath && airlineLogosModules[fullPath]) {
    return airlineLogosModules[fullPath] as string
  }

  return AirlineDefault
}

/**
 * Shared <img> error handler for airline logos.
 * Replaces the broken image source with the default airline logo.
 */
export function onAirlineImageError(event: Event) {
  const target = event.target as HTMLImageElement | null
  if (target) {
    target.src = AirlineDefault
  }
}

// Re-export default logo so components can reference it directly if needed.
export { AirlineDefault }


