export type Airline = { name: string; logo?: string; code?: string }
export type EndPoint = {
  date?: string
  time: string
  code?: string
  terminal?: string
  airportName?: string
}
export type Segment = {
  dep: EndPoint
  arr: EndPoint
  carrier?: Airline
  flightNo?: string
  equipment?: string
  durationMinutes?: number
}
export type TransferNote = {
  location?: string
  durationMinutes?: number
  differentAirport?: boolean
  baggageThrough?: boolean
}
export type FareNoteType = 'allowed' | 'permitted' | 'notallowed'
export type FareIconType = 'suitcase' | 'ticket' | 'calendar' | 'clock' | 'info'
export type FareOption = {
  id: string
  cabin: string
  price: number
  notes: { type: FareNoteType; icon: FareIconType; text: string }[]
}

export type CardRow = {
  id: string
  airlines: Airline[]
  head: { dep: EndPoint; arr: EndPoint }
  segments: Segment[]
  transferNotes?: {
    location?: string
    durationMinutes?: number
    differentAirport?: boolean
    baggageThrough?: boolean
  }[]
  durationMinutes: number
  stopsCount: number
  priceFrom: number
  fareOptions?: any[]
}
