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

export interface FareSegment {
  marketingCarrier: string;
  operatingCarrier: string;
  flightNumber: string;
  fromAirport: string;
  toAirport: string;
  departureDateLocal: string; // Format: YYYY-MM-DD
  departureTimeLocal: string; // Format: HH:MM (24-hour)
  rbd: string;
}

export interface NamedPassenger {
  ptc: 'ADT' | 'CNN' | 'INF';
  age: number;
}

export interface Pax {
  adt: number;
  cnn: number;
  inf: number;
  named?: NamedPassenger[];
}

export interface FlightRequest {
  segments: FareSegment[];
  pax: Pax;
}
export interface Passenger {
  id: string
  type: string
  lastName: string
  firstName: string
  gender: string
  birthDate: Date
  birthDateText: string
  nationality: string
}
export interface Contact {
  name: string
  code: string
  phone: string
  email: string
}
export interface ReceiptInfo {
  isNeedReceipt: boolean
  receiptTitle: string
  uniformNumber: string
  isNeedFlightList: boolean
}
export interface AssistanceInfo {
  isNeedAssistance: boolean
  description: string
}

export interface ItinerarySector {
  order: number;
  departureAirportCode: string;
  arrivalAirportCode: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  marketingAirlineCode: string;
  flightNo: string;
  bookingClass: string;
}

export interface Itinerary {
  order: number;
  departureAirportCode: string;
  arrivalAirportCode: string;
  sectors: ItinerarySector[];
}

export interface PassengerDetail {
  passengerSequence: string;
  passengerName: string;
  pnrSequence: string;
  amountWithTax: number;
  tax: number;
  paymentDeadline: string;
}

export interface Order {
  pnrCode: string;
  totalAmount: number;
  orderNumber: string;
  orderUniqId: string;
  details: PassengerDetail[];
}

export interface Flight {
  departTime: string
  departAirport: string
  arriveTime: string
  arriveAirport: string
  flight: string
  cabin: string
  status: string
};

export interface Item {
  checked: boolean
  name: string
  productName: string
  fare: number
  tax: number
  paid: number
  deadline: string
};

export interface OrderResult {
  msg_code: string
  msg: string
  RET01: string
  RET02: string
  RET03: string
}