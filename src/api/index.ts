import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.API_BASE_URL,
});

export function getAirlines() {
    return api.get('https://galilee-flight-backend.pamis.dev/api/airline')
}

export function getLocations() {
    return api.get('https://galilee-flight-backend.pamis.dev/api/location')
}

export function flightSearch(req: any) {
    return api.post('https://galilee-flight-backend.pamis.dev/api/flight-search', req)
}

export function signIn(req: any) {
    return api.post('https://galilee-flight-backend.pamis.dev/api/Liyi/FA01', req)
}

export function sendSMS(req: any) {
    return api.post('https://galilee-flight-backend.pamis.dev/api/Liyi/FA01B', req)
}

export function getAirlineAlliance() {
    return api.get('https://galilee-flight-backend.pamis.dev/api/airline-alliance/airlines')
}

export function getFareRule(req: any) {
    return api.post('https://galilee-flight-backend.pamis.dev/api/fare-rule', req)
}

export function booking(req: any) {
    return api.post('https://galilee-flight-backend.pamis.dev/api/booking', req)
}

export function LiyiFP04(req: any) {
    return api.post('https://galilee-flight-backend.pamis.dev/api/Liyi/FP04', req)
}