/**
 * Airline Logo Utility
 * 
 * Generates airline logo URLs based on environment configuration.
 * 
 * Test environment: https://image-test.galilee.com.tw/images/{airlineCode}.png
 * Production environment: https://image.galilee.com.tw/images/{airlineCode}.png
 */

import AirlineDefault from '@/assets/imgs/airlines/airline-default.svg'

/**
 * Get the base URL for airline images from environment variable
 */
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://image-test.galilee.com.tw'

/**
 * Resolves the airline logo URL for a given airline code
 * @param code - The IATA airline code (e.g., 'BR', 'CI', 'AA')
 * @returns The URL to the airline logo image
 */
export function resolveAirlineLogo(code?: string): string {
  if (!code) return AirlineDefault
  return `${IMAGE_BASE_URL}/images/${code}.png`
}

/**
 * Default airline logo for fallback
 */
export { AirlineDefault }

/**
 * Handler for image load errors - falls back to default airline logo
 */
export function onAirlineImageError(event: Event): void {
  const target = event.target as HTMLImageElement
  target.src = AirlineDefault
}
