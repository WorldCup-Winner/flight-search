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
  operatingCarrier?: string;
  flightNumber: string;
  fromAirport: string;
  toAirport: string;
  departureDateLocal: string; // Format: YYYY-MM-DD
  departureTimeLocal: string; // Format: HH:MM (24-hour)
  rbd?: string;
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

export interface ContactInfo {
  firstNameOfContactPerson: string
  lastNameOfContactPerson: string
  genderOfContactPerson: number
  mobileNumberCountryCode: string
  contactMobileNumber: string
  contactEmail: string
  orderMethod?: number
  registrationIdType?: number
  registrationIdNumber?: string
  registrationPassword?: string
  mobileVerificationId?: string
  memberId?: string
  lineId?: string
  preferredContactMethod?: number
  assignedLocationCode?: string
  assignedConsultantId?: string
}

export interface ReceiptInfo {
  isNeedReceipt: boolean
  receiptTitle?: string
  uniformNumber?: string
  isNeedFlightList: boolean
}

export interface AssistanceInfo {
  isNeedAssistance: boolean
  description?: string
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
  departureTime: string
  departureAirportCode: string
  departureAirportName: string
  arrivalTime: string
  arrivalAirportCode: string
  arrivalAirportName: string
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

export interface FareRuleRequest {
  segments: FareSegment[]
  pax: Pax
}

export interface FareRuleResponse {
  head: {
    code: number
    message: string
  }
  data: {
    fareRuleTable: FareRuleTable[]
    baggage: FareRuleBaggageData[]
    fareSummary: FareRuleSummaryData[]
  }
}

export interface FareRuleTable {
  type: string
  before: number | null
  after: number | null
  currency: string
  passengerType: string
  passengerTypeDisplay: string
}

export interface FareRuleBaggageData {
  order: number
  departureCityCode: string
  departureCityName: string
  arrivalCityCode: string
  arrivalCityName: string
  passengers: FareRuleBaggagePassengerData[]
}

export interface FareRuleBaggagePassengerData {
  passengerType: string
  carryOnData: FareRuleBaggageDetailData
  checkInData: FareRuleBaggageDetailData
}

export interface FareRuleBaggageDetailData {
  weight: number
  unit: string | null
  piece: number
  size: string | null
  text: string
}

export interface FareRuleSummaryData {
  passengerType: string
  price: number
  taxAmount: number
}


export interface BookingRequestViewModel {
  itineraries: BookingItinerary[]
  passengers: PassengerInfo[]
  contactInfo: ContactInfo
  receiptInfo?: ReceiptInfo | null
  assistanceInfo?: AssistanceInfo | null
  isAgreedToTheTerms: boolean
}

export interface BookingItinerary {
  order: number
  departureAirportCode: string
  arrivalAirportCode: string
  sectors: BookingSector[]
}

export interface BookingSector {
  order: number
  departureAirportCode: string
  arrivalAirportCode: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  marketingAirlineCode: string
  flightNo: string
  bookingClass: string
}

export interface PassengerInfo {
  firstName: string
  lastName: string
  gender: number // 0 = female, 1 = male
  dateOfBirth: string
  nationality: string
  passengerType: number // 0 = adult, 1 = child/infant
  documentType: number // 0 = passport, 1 = ID card
  documentNumber: string
  documentExpiryDate: string
  mobileNumberCountryCode?: string
  mobileNumber?: string
  email?: string
  isTheOrderer: boolean
  mainlandTravelPermitNumber?: string | null
  mainlandTravelPermitExpiryDate?: string | null
  mealPreference?: string
  frequentFlyerNumber?: string
  frequentFlyerAirline?: string
  specialStatus?: string | null
}

export interface ContactInfo {
  firstNameOfContactPerson: string
  lastNameOfContactPerson: string
  genderOfContactPerson: number
  mobileNumberCountryCode: string
  contactMobileNumber: string
  contactEmail: string
  orderMethod?: number
  registrationIdType?: number
  registrationIdNumber?: string
  registrationPassword?: string
  mobileVerificationId?: string
  memberId?: string
  lineId?: string
  preferredContactMethod?: number
  assignedLocationCode?: string
  assignedConsultantId?: string
}

export interface ReceiptInfo {
  isNeedReceipt: boolean
  receiptTitle?: string
  uniformNumber?: string
  isNeedFlightList: boolean
}

export interface AssistanceInfo {
  isNeedAssistance: boolean
  description?: string
}