
import type { CardRow, FareIconType, FareNoteType } from '@/utils/types'

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
  return n.toLocaleString('en-US')
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

export function makeDirect(code: string, name: string, logo: string, t1: string, t2: string, dur: number, price: number, opt: any = {}): CardRow {
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