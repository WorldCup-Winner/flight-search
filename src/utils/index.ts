
import type { CardRow, FareIconType, FareNoteType, Sector } from '@/utils/types'

export const minutesToText = (min: number) => {
  const h = Math.floor(min / 60)
    .toString()
    .padStart(2, '0')
  const m = (min % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

export const formatCurrency = (n?: number) => {
  if (n == null) return ''
  return `TWD ${n.toLocaleString('en-US')}`
}

export const getDualRangeStyle = (start: number, end: number) => {
  const min = 0,
    max = 1439
  const left = ((start - min) / (max - min)) * 100
  const right = ((end - min) / (max - min)) * 100
  return { '--start': `${left}%`, '--end': `${right}%` }
}

export const toDuration = (min?: number) => {
  if (min == null) return ''
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}小時${m}分鐘`
}

export const formatPrice = (n: number) => {
  return n
}

export const timeToMin = (t: string): number => {
  const [hs = '0', ms = '0'] = t?.split?.(':') ?? ['0', '0']
  const h = Number(hs)
  const m = Number(ms)
  return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0)
}

export const inWindow = (v: number, [s, e]: [number, number]) => {
  return v >= s && v <= e
}

export const goPrivacy = () => {
  window.open('https://www.galilee.com.tw/Privacy', '_blank', 'noopener,noreferrer')
}

export const goMemberPage = () => {
  window.open('https://www.galilee.com.tw/Member/Login', '_blank', 'noopener,noreferrer')
}

export function makeDirect(code: string, name: string, logo: string, t1: string, t2: string, dur: number, price: number, opt: any = {}): any {
  return {
    id: cryptoId(),
    airlines: [{ name, logo, code }],
    head: { dep: { time: t1, code: 'TPE', terminal: 'T1' }, arr: { time: t2, code: 'NRT', terminal: 'T1N' } },
    segments: [{
      dep: { date: '8月27日', time: t1, code: 'TPE', terminal: 'T1', airportName: 'TPE桃園國際機場T1台北' },
      arr: { date: '8月27日', time: t2, code: 'NRT', terminal: 'T1N', airportName: 'NRT成田機場T1N東京' },
      carrier: { name, logo, code }, flightNo: `${code}014`, equipment: '空中巴士 A320', durationMinutes: dur
    }],
    durationMinutes: dur,
    stopsCount: 0,
    priceFrom: price,
    fareOptions: opt.fare ? demoFares(price) : undefined
  }
}

export function demoFares(base: number) {
  return [
    {
      id: 'F1', cabin: '商務艙', price: base + 9880, notes: [
        { type: 'allowed', icon: 'suitcase', text: '行李每成人1*23KG' },
        { type: 'allowed', icon: 'ticket', text: '退票費 TWD 5,136起' },
        { type: 'allowed', icon: 'calendar', text: '日期更改 TWD 2,568起' },
        { type: 'allowed', icon: 'clock', text: '付款後48小時內出票' },
        { type: 'allowed', icon: 'info', text: '由2至多張機票組成' },
        { type: 'allowed', icon: 'info', text: '由海外供應商提供' },
      ]
    },
    {
      id: 'F2', cabin: '商務艙', price: base + 1900, notes: [
        { type: 'notallowed', icon: 'suitcase', text: '無免費托運行李' },
        { type: 'notallowed', icon: 'ticket', text: '不可退票' },
        { type: 'notallowed', icon: 'calendar', text: '不可更改日期' },
        { type: 'notallowed', icon: 'clock', text: '出票時間' },
        { type: 'allowed', icon: 'info', text: '由2至多張機票組成' },
        { type: 'allowed', icon: 'info', text: '由海外供應商提供' },
      ]
    },
    {
      id: 'F3', cabin: '商務艙', price: base - 200, notes: [
        { type: 'notallowed', icon: 'suitcase', text: '無免費托運行李' },
        { type: 'notallowed', icon: 'ticket', text: '不可退票' },
        { type: 'notallowed', icon: 'calendar', text: '不可更改日期' },
        { type: 'notallowed', icon: 'clock', text: '出票時間' },
        { type: 'allowed', icon: 'info', text: '由2至多張機票組成' },
        { type: 'allowed', icon: 'info', text: '由海外供應商提供' },
      ]
    },
  ]
}

export function cryptoId() {
  return Math.random().toString(36).slice(2, 10)
}

// ✅ Import all the icons eagerly; keys will be absolute paths starting with /src
const iconMap = import.meta.glob('/src/assets/imgs/rules/icon-*.svg', {
  eager: true,
  import: 'default'
}) as Record<string, string>

export function noteIcon(type: FareNoteType, icon: FareIconType) {
  const key = `/src/assets/imgs/rules/icon-${icon}-${type}.svg`
  // optional: provide a safe fallback if a file is missing
  return iconMap[key] ?? iconMap['/src/assets/imgs/rules/icon-info-allowed.svg']
}

export function noteTextClass(type: FareNoteType) {
  switch (type) {
    case 'allowed': return 'text-[#166534]'     // green-800
    case 'permitted': return 'text-[#991b1b]'     // red-800
    case 'notallowed': return 'text-[#92400e]'     // amber-800
    default: return 'text-[#6b7280]'     // gray-500
  }
}

export function formatDate(date: Date | null) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${y} / ${m} / ${d} (${weekdays[date.getDay()]})`
}

export function formatDateToChinese(dateStr: string) {
  const date = new Date(dateStr); // e.g., "November 1"

  const month = date.getMonth() + 1; // JS months are 0-based
  const day = date.getDate();

  return `${month}月${day}日`;
}

export function formatDateToChineseWithWeek(dateStr: string) {
  const date = new Date(dateStr); // e.g., "November 1"

  const month = date.getMonth() + 1; // JS months are 0-based
  const day = date.getDate();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']

  return `${month}月${day}日 週${weekdays[date.getDay()]}`;
}


export function formatDateWithYYYYMMDD(input: string): string {
  if (!input) return '';
  const digits = input.replace(/[^\d]/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(input)) return input.replace(/\//g, '-');
  return input;
}

export function formateDateYYYYMMDDHHMM(dateStr: string) {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '/')
  } catch {
    return dateStr
  }
}

export function getMaxDate(range: number = 350) {
  const max = new Date()
  max.setDate(new Date().getDate() + range)
  return max
}

export function airlineLogoFor(sec: Sector) {
  const code = sec.marketingAirlineCode || sec.operatingAirlineCode
  return resolveAirlineLogo(code)
}

export function airlineLogoForWithCode(code: string) {
  return resolveAirlineLogo(code)
}

import AirlineDefault from '@/assets/imgs/airlines/airline-default.svg'

export function resolveAirlineLogo(code?: string) {
  if (!code) return AirlineDefault;
  const url = `imgs/airlines/${code}.png`;
  return url ? url : AirlineDefault;  // Return default if URL is not valid
}

export function onImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = AirlineDefault;  // Fallback to default logo when image fails to load
}

export function formatBaggage(data: { text: string; piece: number; weight: number } | null): string {
  if (!data) return '資訊待確認';
  if (data.text) return data.text;
  if (data.piece > 0 && data.weight > 0) return `${data.piece}件, 每件${data.weight}公斤`;
  if (data.piece > 0) return `${data.piece}件`;
  if (data.weight > 0) return `${data.weight}公斤`;
  return '無免費行李';
}

export function getPassengerDisplay(type: string): string {
  const displays: Record<string, string> = {
    'ADT': '成人',
    'CNN': '孩童',
    'CHD': '孩童',
    'INF': '嬰兒'
  };
  return displays[type] || type;
}

export function formatPriceOnFareRule(price: number | null, currency: string = 'TWD'): string {
  if (price === null) return '不可適用';
  if (price === 0) return '免費';
  if (price === -1) return '不可退改';
  return `${currency} ${price.toLocaleString()}`;
}

/**
 * Formats a date as YYYY-MM-DD in local timezone without UTC conversion
 * This prevents timezone issues where dates shift by -1 day when converted to UTC
 */
export function formatDateLocal(date: Date | string | null | undefined): string | null {
  if (!date) return null

  let dateObj: Date
  if (typeof date === 'string') {
    // If it's already in YYYY-MM-DD format, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date
    }
    // Otherwise parse it
    dateObj = new Date(date)
  } else {
    dateObj = date
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return null
  }

  // Use local time methods to avoid timezone conversion
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// URL Parameter utilities for state persistence
export function encodeSearchParams(searchRequest: any): Record<string, string> {
  if (!searchRequest) return {}

  const params: Record<string, string> = {}

  // Trip type - infer from flightSegments
  if (searchRequest.flightSegments) {
    const segmentCount = searchRequest.flightSegments.length
    const hasReturnDate = searchRequest.flightSegments[0]?.returnDate

    if (segmentCount === 1 && hasReturnDate) {
      params.tripType = 'roundtrip'
    } else if (segmentCount === 1) {
      params.tripType = 'oneway'
    } else if (segmentCount === 2) {
      params.tripType = 'roundtrip'
    } else {
      params.tripType = 'multi'
    }

    // Flight segments
    searchRequest.flightSegments.forEach((seg: any, idx: number) => {
      if (seg.departureLocation) params[`dep${idx}`] = seg.departureLocation
      if (seg.arrivalLocation) params[`arr${idx}`] = seg.arrivalLocation
      if (seg.departureDate) params[`date${idx}`] = seg.departureDate
      if (seg.returnDate) params[`returnDate${idx}`] = seg.returnDate
    })
  }

  // Passengers
  if (searchRequest.adultCount) params.adults = String(searchRequest.adultCount)
  if (searchRequest.childCount) params.children = String(searchRequest.childCount)
  if (searchRequest.babyCount) params.infants = String(searchRequest.babyCount)

  // Filters
  if (searchRequest.carrierId) params.airline = searchRequest.carrierId
  if (searchRequest.cabinId) params.cabin = searchRequest.cabinId
  if (searchRequest.isNonStopFlight) params.nonStop = String(searchRequest.isNonStopFlight)

  // Selected ref numbers (for multi-segment searches)
  if (searchRequest.selectedRefNumbers?.length) {
    params.selectedRefs = searchRequest.selectedRefNumbers.join(',')
  }

  return params
}

export function decodeSearchParams(query: Record<string, string | string[]>): any {
  const params: any = {}

  // Trip type
  const tripType = Array.isArray(query.tripType) ? query.tripType[0] : query.tripType
  if (!tripType) return null

  // Build flight segments
  const segments: any[] = []
  let segmentIdx = 0

  while (true) {
    const dep = Array.isArray(query[`dep${segmentIdx}`]) ? query[`dep${segmentIdx}`][0] : query[`dep${segmentIdx}`]
    const arr = Array.isArray(query[`arr${segmentIdx}`]) ? query[`arr${segmentIdx}`][0] : query[`arr${segmentIdx}`]
    const date = Array.isArray(query[`date${segmentIdx}`]) ? query[`date${segmentIdx}`][0] : query[`date${segmentIdx}`]

    if (!dep || !arr || !date) break

    segments.push({
      order: segmentIdx + 1,
      departureLocation: dep,
      arrivalLocation: arr,
      departureDate: date,
      returnDate: null
    })

    // Check for return date (for roundtrip)
    if (segmentIdx === 0 && tripType === 'roundtrip') {
      const returnDate = Array.isArray(query[`returnDate0`]) ? query[`returnDate0`][0] : query[`returnDate0`]
      if (returnDate) {
        segments[0].returnDate = returnDate
      }
    }

    segmentIdx++

    // Limit for safety
    if (segmentIdx > 10) break
  }

  if (segments.length === 0) return null

  params.flightSegments = segments

  // Passengers
  const adults = Array.isArray(query.adults) ? query.adults[0] : query.adults
  const children = Array.isArray(query.children) ? query.children[0] : query.children
  const infants = Array.isArray(query.infants) ? query.infants[0] : query.infants

  if (adults) params.adultCount = parseInt(adults) || 1
  if (children) params.childCount = parseInt(children) || 0
  if (infants) params.babyCount = parseInt(infants) || 0

  // Filters
  const airline = Array.isArray(query.airline) ? query.airline[0] : query.airline
  const cabin = Array.isArray(query.cabin) ? query.cabin[0] : query.cabin
  const nonStop = Array.isArray(query.nonStop) ? query.nonStop[0] : query.nonStop

  if (airline) params.carrierId = airline
  if (cabin) params.cabinId = cabin
  if (nonStop) params.isNonStopFlight = nonStop === 'true'

  // Selected ref numbers
  const selectedRefs = Array.isArray(query.selectedRefs) ? query.selectedRefs[0] : query.selectedRefs
  if (selectedRefs) {
    params.selectedRefNumbers = selectedRefs.split(',').map((s: string) => parseInt(s)).filter((n: number) => !isNaN(n))
  } else {
    params.selectedRefNumbers = []
  }

  return params
}

export function updateURLParams(params: Record<string, string | null>, router: any, replace = false) {
  const currentQuery = { ...router.currentRoute.value.query }

  // Remove null values
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === undefined || params[key] === '') {
      delete currentQuery[key]
    } else {
      currentQuery[key] = params[key] as string
    }
  })

  if (replace) {
    router.replace({ query: currentQuery })
  } else {
    router.push({ query: currentQuery })
  }
}