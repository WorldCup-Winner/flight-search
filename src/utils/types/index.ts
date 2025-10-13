export type Airline = {
  id?: string;
  iataCode: string;
  nameZhTw: string;
  nameEnUs?: string;
}

export type Location = {
  region: string;
  airports: [
    {
      iataCode: string;
      cityNameZhTw: string;
      airportNameZh: string;
    }
  ];
}

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

export interface CardRow {
  refNumber: number
  price: number
  taxAmount: number
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  crossDays: number
  durationMinutes: number
  departureCityCode: string
  arrivalCityCode: string
  departureCityName: string
  arrivalCityName: string
  departureAirportCode: string
  departureAirportName: string
  arrivalAirportCode: string
  arrivalAirportName: string
  departureTerminal: string
  arrivalTerminal: string
  airlineName: string[]
  airlineCode: string[]
  seats: any[] // can type later if you have structure
  sectors: Sector[]
}

export type Craft = {
  craftType: string
  enName: string | null
  minSeats: number
  maxSeats: number
  craftName: string
}

export interface Sector {
  departureDate: string
  departureTime: string
  toDate: string
  arrivalDate: string
  arrivalTime: string
  isRedEye: boolean
  durationMinutes: number
  departureCityCode: string
  departureCityName: string
  arrivalCityCode: string
  arrivalCityName: string
  flightNo: string
  operatingAirlineCode: string
  operatingAirlineName: string
  marketingAirlineCode: string
  marketingAirlineName: string
  operatingFlightNo: string
  craft: Craft
  departureAirportCode: string
  departureAirportName: string
  departureTerminal: string
  arrivalAirportCode: string
  arrivalAirportName: string
  arrivalTerminal: string
  cabinType: string
  cabinDesc: string
  bookingClass: string
  crossDays: number
  transfer: {
    transferCity: string
    transferStayMinutes: number
    isCrossday: boolean
    isChangeAirport: boolean
    isChangeTerminal: boolean
  } | null
  baggageStraight: number
}

export interface AirlineAlliance {
  id: string,
  nameZh: string,
  nameEn: string,
  airlines: Array<Airline>
}